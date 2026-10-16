const themeButton = document.querySelector("#theme");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
}

function changeTheme() {
  document.body.classList.toggle("light");
  if (document.body.classList.contains("light")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
}

themeButton.addEventListener("click", changeTheme);
