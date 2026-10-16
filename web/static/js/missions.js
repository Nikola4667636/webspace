const filters = document.querySelectorAll(".tab");
const missions = document.querySelectorAll(".mission");
const count = document.querySelector("#count");

function filterMissions(type) {
  let shown = 0;

  missions.forEach((mission) => {
    const visible = type === "all" || mission.dataset.type === type;
    mission.classList.toggle("hidden", !visible);
    if (visible) {
      shown = shown + 1;
    }
  });

  count.textContent = shown;
}

filters.forEach((filter) => {
  filter.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    filter.classList.add("active");
    filterMissions(filter.dataset.filter);
  });
});

missions.forEach((mission) => {
  const button = mission.querySelector(".button");
  const more = mission.querySelector(".mission-more");

  button.addEventListener("click", () => {
    more.classList.toggle("hidden");
    if (more.classList.contains("hidden")) {
      button.textContent = "Подробнее";
    } else {
      button.textContent = "Скрыть";
    }
  });
});
