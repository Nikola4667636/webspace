import type { Launch, LaunchResponse, RawLaunch } from "./types";

const API_URL = "https://ll.thespacedevs.com/2.2.0/launch/previous/?limit=60&ordering=-net";
const REQUEST_TIMEOUT = 15000;
const CACHE_KEY = "launches-cache";
const CACHE_TTL = 10 * 60 * 1000;

export class HttpError extends Error {
  status: number;

  constructor(status: number) {
    super(`HTTP ${status}`);
    this.status = status;
  }
}

function normalize(raw: RawLaunch): Launch {
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

export async function fetchLaunches(): Promise<Launch[]> {
  const response = await fetch(API_URL, { signal: AbortSignal.timeout(REQUEST_TIMEOUT) });

  if (!response.ok) {
    throw new HttpError(response.status);
  }

  const data = (await response.json()) as LaunchResponse;
  if (!Array.isArray(data.results)) {
    throw new Error("Unexpected response format");
  }

  return data.results.map(normalize);
}

export function readCache(): Launch[] | null {
  try {
    const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? "null") as { time: number; data: Launch[] } | null;
    if (cached && Date.now() - cached.time < CACHE_TTL && Array.isArray(cached.data)) {
      return cached.data;
    }
  } catch {
    return null;
  }
  return null;
}

export function saveCache(data: Launch[]): void {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
  } catch {
    return;
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 429) {
      return "Превышен лимит запросов к API (около 15 в час). Подождите несколько минут и повторите попытку.";
    }
    if (error.status >= 500) {
      return `Сервер данных временно недоступен (ошибка ${error.status}). Попробуйте позже.`;
    }
    return `Не удалось получить данные (ошибка ${error.status}).`;
  }
  if (error instanceof DOMException && error.name === "TimeoutError") {
    return "Сервер отвечает слишком долго. Попробуйте ещё раз.";
  }
  if (error instanceof TypeError) {
    return "Нет соединения с сервером. Проверьте интернет и попробуйте ещё раз.";
  }
  return "Не удалось загрузить данные. Попробуйте ещё раз.";
}
