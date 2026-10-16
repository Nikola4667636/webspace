const imagesPath = "../static/images/";

const planets = [
  {
    name: "Земля",
    image: "planet-earth.svg",
    lead: "Наш дом и единственная известная планета с жизнью.",
    facts: [
      "Диаметр: около 12 742 км",
      "Спутник: Луна",
      "Около 71% поверхности покрыто водой"
    ],
    more: "Земля защищена магнитным полем и атмосферой из азота и кислорода, поэтому на ней возможна жизнь."
  },
  {
    name: "Марс",
    image: "planet-mars.svg",
    lead: "Красная планета с ржавой пылью на поверхности.",
    facts: [
      "Диаметр: около 6 779 км",
      "Спутники: Фобос и Деймос",
      "Сутки: около 24 часов 37 минут"
    ],
    more: "На Марсе находится гора Олимп. Это самый высокий известный вулкан Солнечной системы, около 22 км."
  },
  {
    name: "Юпитер",
    image: "planet-jupiter.svg",
    lead: "Самая большая планета Солнечной системы.",
    facts: [
      "Диаметр: около 140 000 км",
      "Состоит в основном из водорода и гелия",
      "Сутки: около 10 часов"
    ],
    more: "Большое красное пятно на Юпитере это гигантский шторм. Его наблюдают уже сотни лет."
  },
  {
    name: "Сатурн",
    image: "planet-saturn.svg",
    lead: "Планета с самыми яркими кольцами.",
    facts: [
      "Диаметр: около 116 500 км",
      "Кольца состоят из льда и камней",
      "Средняя плотность меньше плотности воды"
    ],
    more: "Кольца Сатурна тянутся на сотни тысяч километров, но их толщина обычно не больше десятков метров."
  }
];

const tabs = document.querySelectorAll(".tab");
const planetImage = document.querySelector("#planet-image");
const planetName = document.querySelector("#planet-name");
const planetLead = document.querySelector("#planet-lead");
const planetFacts = document.querySelector("#planet-facts");
const planetMore = document.querySelector("#planet-more");
const moreButton = document.querySelector("#more");
const nextButton = document.querySelector("#next");

let current = 0;

function showPlanet(index) {
  current = index;
  const planet = planets[index];

  planetImage.src = imagesPath + planet.image;
  planetImage.alt = planet.name;
  planetName.textContent = planet.name;
  planetLead.textContent = planet.lead;
  planetMore.textContent = planet.more;

  planetFacts.innerHTML = "";
  planet.facts.forEach((fact) => {
    const item = document.createElement("li");
    item.textContent = fact;
    planetFacts.appendChild(item);
  });

  tabs.forEach((tab, tabIndex) => {
    tab.classList.toggle("active", tabIndex === index);
  });
}

function toggleMore() {
  planetMore.classList.toggle("hidden");
  if (planetMore.classList.contains("hidden")) {
    moreButton.textContent = "Подробнее";
  } else {
    moreButton.textContent = "Скрыть";
  }
}

function showNext() {
  showPlanet((current + 1) % planets.length);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showPlanet(index));
});

moreButton.addEventListener("click", toggleMore);
nextButton.addEventListener("click", showNext);
