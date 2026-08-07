(() => {
  "use strict";

  const root = document.documentElement;
  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    root.dataset.theme = savedTheme;
  } else {
    root.dataset.theme = window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }
})();
