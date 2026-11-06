// Launch Library 2 (The Space Devs): public API, no key, HTTPS, CORS enabled.
// The anonymous limit is about 15 requests per hour, so data is loaded once
// and search/category filtering is done on the client.
const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=60&ordering=-net";
const REQUEST_TIMEOUT = 15000;
const CACHE_KEY = "launches-cache";
const CACHE_TTL = 10 * 60 * 1000;

const STATUS_NAMES = {
  Success: "Успешно",
  Failure: "Неудача",
  "Partial Failure": "Частичная неудача",
  Go: "Готов к запуску",
  TBC: "Ожидает подтверждения",
  TBD: "Дата уточняется"
};

const searchInput = document.querySelector("#search");
const categorySelect = document.querySelector("#category");
const refreshButton = document.querySelector("#refresh");
const statusBox = document.querySelector("#status");
const list = document.querySelector("#launch-list");
const count = document.querySelector("#count");

let launches = [];
let requestId = 0;
let searchTimer = null;

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

// Keep only the fields the page needs and tolerate missing values
function normalizeLaunch(raw) {
  const image = typeof raw.image === "string" ? raw.image : raw.image?.image_url;
  const configuration = raw.rocket?.configuration;

  return {
    id: raw.id,
    name: raw.name ?? "Без названия",
    date: raw.net ?? "",
    statusAbbrev: raw.status?.abbrev ?? "",
    statusName: raw.status?.name ?? "",
    provider: raw.launch_service_provider?.name ?? "Неизвестно",
    rocket: configuration?.full_name ?? configuration?.name ?? "",
    mission: raw.mission?.name ?? "",
    missionType: raw.mission?.type ?? "",
    description: raw.mission?.description ?? "",
    pad: raw.pad?.name ?? "",
    location: raw.pad?.location?.name ?? "",
    image: image ?? ""
  };
}

async function fetchLaunches() {
  const response = await fetch(API_URL, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT)
  });

  // fetch does not reject on HTTP 404/429/500, so check response.ok manually
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  if (!Array.isArray(data.results)) {
    throw new Error("Unexpected response format");
  }

  return data.results.map(normalizeLaunch);
}

function readCache() {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    if (cached && Date.now() - cached.time < CACHE_TTL && Array.isArray(cached.data)) {
      return cached.data;
    }
  } catch {
    // Broken or unavailable storage is not critical
  }
  return null;
}

function saveCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
  } catch {
    // Storage may be full or disabled
  }
}

function getErrorMessage(error) {
  if (error.status === 429) {
    return "Превышен лимит запросов к API (около 15 в час). Подождите несколько минут и повторите попытку.";
  }
  if (error.status >= 500) {
    return `Сервер данных временно недоступен (ошибка ${error.status}). Попробуйте позже.`;
  }
  if (error.status) {
    return `Не удалось получить данные (ошибка ${error.status}).`;
  }
  if (error.name === "TimeoutError") {
    return "Сервер отвечает слишком долго. Попробуйте ещё раз.";
  }
  if (error instanceof TypeError) {
    return "Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.";
  }
  return "Не удалось загрузить данные. Попробуйте ещё раз.";
}

function setBusy(busy) {
  refreshButton.disabled = busy;
  refreshButton.textContent = busy ? "Загрузка…" : "Обновить";
}

function showStatus(content, isError) {
  statusBox.replaceChildren(...content);
  statusBox.classList.toggle("error", Boolean(isError));
  statusBox.classList.remove("hidden");
  list.classList.add("hidden");
}

function hideStatus() {
  statusBox.classList.add("hidden");
  list.classList.remove("hidden");
}

function showLoading() {
  count.textContent = "0";
  showStatus([createElement("div", "spinner"), createElement("p", "", "Загрузка…")], false);
}

function showEmpty() {
  showStatus([createElement("p", "", "Ничего не найдено")], false);
}

function showError(error) {
  const retryButton = createElement("button", "button", "Повторить попытку");
  retryButton.type = "button";
  retryButton.addEventListener("click", () => loadLaunches(true));

  count.textContent = "0";
  showStatus([createElement("p", "", getErrorMessage(error)), retryButton], true);
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Дата неизвестна";
  }
  return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function createCard(launch) {
  const card = createElement("li", "card mission");

  const top = createElement("div", "mission-top");
  top.append(
    createElement("span", "year", formatDate(launch.date)),
    createElement("span", "badge", STATUS_NAMES[launch.statusAbbrev] ?? (launch.statusName || "Статус неизвестен"))
  );

  card.append(top, createElement("h3", "", launch.name), createElement("p", "", launch.provider));

  if (launch.image) {
    const image = createElement("img", "launch-image");
    image.src = launch.image;
    image.alt = launch.name;
    image.loading = "lazy";
    // Hide broken pictures instead of showing an empty frame
    image.addEventListener("error", () => image.remove());
    card.append(image);
  }

  const more = createElement("div", "mission-more hidden");
  more.append(createElement("p", "", launch.description || "Описание миссии отсутствует."));
  if (launch.rocket) {
    more.append(createElement("p", "", `Ракета: ${launch.rocket}`));
  }
  if (launch.missionType) {
    more.append(createElement("p", "", `Тип миссии: ${launch.missionType}`));
  }
  if (launch.pad || launch.location) {
    more.append(createElement("p", "", `Площадка: ${[launch.pad, launch.location].filter(Boolean).join(", ")}`));
  }

  const button = createElement("button", "button", "Подробнее");
  button.type = "button";
  button.setAttribute("aria-expanded", "false");
  button.addEventListener("click", () => {
    const hidden = more.classList.toggle("hidden");
    button.textContent = hidden ? "Подробнее" : "Скрыть";
    button.setAttribute("aria-expanded", String(!hidden));
  });

  card.append(more, button);
  return card;
}

function fillCategories() {
  const selected = categorySelect.value;
  const providers = [...new Set(launches.map((launch) => launch.provider))].sort((a, b) => a.localeCompare(b));

  categorySelect.replaceChildren(new Option("Все", "all"));
  providers.forEach((provider) => categorySelect.append(new Option(provider, provider)));

  categorySelect.value = providers.includes(selected) ? selected : "all";
}

function getFilteredLaunches() {
  const query = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;

  return launches.filter((launch) => {
    const matchesCategory = category === "all" || launch.provider === category;
    const text = [launch.name, launch.provider, launch.rocket, launch.mission].join(" ").toLowerCase();
    return matchesCategory && text.includes(query);
  });
}

function render() {
  const items = getFilteredLaunches();
  count.textContent = items.length;

  if (items.length === 0) {
    list.replaceChildren();
    showEmpty();
    return;
  }

  hideStatus();
  list.replaceChildren(...items.map(createCard));
}

async function loadLaunches(force = false) {
  const currentRequest = ++requestId;
  setBusy(true);
  showLoading();

  try {
    // The refresh and retry buttons skip the cache and ask the API again
    let data = force ? null : readCache();
    if (!data) {
      data = await fetchLaunches();
      saveCache(data);
    }

    // Ignore a stale response if a newer request has already started
    if (currentRequest !== requestId) {
      return;
    }

    launches = data;
    fillCategories();
    render();
  } catch (error) {
    if (currentRequest === requestId) {
      showError(error);
    }
  } finally {
    if (currentRequest === requestId) {
      setBusy(false);
    }
  }
}

searchInput.addEventListener("input", () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(render, 250);
});

categorySelect.addEventListener("change", render);
refreshButton.addEventListener("click", () => loadLaunches(true));

loadLaunches();
