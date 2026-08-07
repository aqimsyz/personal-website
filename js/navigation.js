(() => {
  "use strict";

  const navbar = document.querySelector("#navbar");
  const nav = document.querySelector("#primary-nav");
  const navLinks = [...document.querySelectorAll("#primary-nav a")];
  const indicator = document.querySelector(".nav-indicator");
  const menuToggle = document.querySelector("#menu-toggle");
  const themeToggle = document.querySelector("#theme-toggle");
  const themeTransition = document.querySelector("#theme-transition");
  const root = document.documentElement;

  function moveIndicator(link) {
    if (!indicator || !link || window.innerWidth <= 900) return;

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translateX(${linkRect.left - navRect.left - 6}px)`;
  }

  function setActiveLink(link) {
    navLinks.forEach(item => item.classList.toggle("is-active", item === link));
    moveIndicator(link);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      setActiveLink(link);
      nav?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

const sections = navLinks
  .map(link => {
    const target = link.getAttribute("href");

    if (!target || !target.startsWith("#")) {
      return null;
    }

    return document.querySelector(target);
  })
  .filter(Boolean);

let navScrollFrame = null;

function updateActiveNavigation() {
  const navbarHeight = navbar?.offsetHeight || 0;

  const detectionPoint =
    navbarHeight + window.innerHeight * 0.28;

  let activeSection = sections[0];

  sections.forEach(section => {
    const rect = section.getBoundingClientRect();

    if (
      rect.top <= detectionPoint &&
      rect.bottom > detectionPoint
    ) {
      activeSection = section;
    }
  });

  if (!activeSection) return;

  const activeLink = navLinks.find(
    link =>
      link.getAttribute("href") ===
      `#${activeSection.id}`
  );

  if (activeLink) {
    setActiveLink(activeLink);
  }
}

function scheduleNavigationUpdate() {
  if (navScrollFrame) return;

  navScrollFrame = requestAnimationFrame(() => {
    updateActiveNavigation();
    navScrollFrame = null;
  });
}

window.addEventListener(
  "scroll",
  scheduleNavigationUpdate,
  { passive: true }
);

window.addEventListener(
  "resize",
  scheduleNavigationUpdate
);

requestAnimationFrame(updateActiveNavigation);

  menuToggle?.addEventListener("click", () => {
    const open = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!open));
    nav?.classList.toggle("is-open", !open);
  });

  document.addEventListener("click", event => {
    if (!navbar?.contains(event.target)) {
      nav?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  themeToggle?.addEventListener("click", event => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    const rect = themeToggle.getBoundingClientRect();

    if (themeTransition) {
      themeTransition.style.left = `${rect.left + rect.width / 2}px`;
      themeTransition.style.top = `${rect.top + rect.height / 2}px`;
      themeTransition.classList.remove("is-active");
      void themeTransition.offsetWidth;
      themeTransition.classList.add("is-active");
    }

    setTimeout(() => {
      root.dataset.theme = nextTheme;
      localStorage.setItem("portfolio-theme", nextTheme);
      themeToggle.setAttribute(
        "aria-label",
        nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    }, 240);

    setTimeout(() => themeTransition?.classList.remove("is-active"), 800);
  });

  window.addEventListener("resize", () => {
    const active = navLinks.find(link => link.classList.contains("is-active"));
    moveIndicator(active);
    if (window.innerWidth > 900) {
      nav?.classList.remove("is-open");
      menuToggle?.setAttribute("aria-expanded", "false");
    }
  });

  themeToggle?.setAttribute(
    "aria-label",
    root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
  );

  requestAnimationFrame(() => {
    const active = navLinks.find(link => link.classList.contains("is-active"));
    moveIndicator(active);
  });
})();
