(() => {
  "use strict";

  const data = window.PORTFOLIO_SKILLS;
  const section = document.querySelector("#skills");
  const skillsShowcase =
  document.querySelector(".skills-showcase");
  const introduction = document.querySelector("#skills-introduction");
  const totalCount = document.querySelector("#skills-total-count");
  const toolCount = document.querySelector("#skills-tool-count");
  const visibleCount = document.querySelector("#skills-visible-count");
  const filterList = document.querySelector("#skills-filter-list");

  const orbitTopbar = document.querySelector(".skills-orbit-panel__topbar");
  const orbitStage = document.querySelector("#skills-orbit-stage");
  const orbitLayer = document.querySelector("#skills-orbit-layer");
  const motionToggle = document.querySelector("#skills-motion-toggle");
  const motionToggleIcon = motionToggle?.querySelector(".skills-motion-toggle__icon");
  const motionToggleLabel = motionToggle?.querySelector(".skills-motion-toggle__label");
  const previousButton = document.querySelector("#skills-previous");
  const nextButton = document.querySelector("#skills-next");
  const currentIndexLabel = document.querySelector("#skills-current-index");
  const totalIndexLabel = document.querySelector("#skills-total-index");
  const progressBar = document.querySelector("#skills-progress-bar");

  const detailPanel = document.querySelector("#skills-detail-panel");
  const detailCode = document.querySelector("#skill-detail-code");
  const detailCategory = document.querySelector("#skill-detail-category");
  const detailSymbol = document.querySelector("#skill-detail-symbol");
  const detailLevel = document.querySelector("#skill-detail-level");
  const detailTitle = document.querySelector("#skill-detail-title");
  const detailSummary = document.querySelector("#skill-detail-summary");
  const detailStrength = document.querySelector("#skill-detail-strength");
  const detailStrengthBar = document.querySelector("#skill-detail-strength-bar");
  const detailToolCount = document.querySelector("#skill-detail-tool-count");
  const detailTools = document.querySelector("#skill-detail-tools");
  const detailEvidence = document.querySelector("#skill-detail-evidence");
  const detailPosition = document.querySelector("#skill-detail-position");
  let detailScrollBody = null;
  let detailScrollbarRail = null;
  let detailScrollbarThumb = null;
  let detailScrollbarFrame = 0;

  if (
    !data?.skills?.length ||
    !section ||
    !orbitStage ||
    !orbitLayer ||
    !filterList ||
    !detailPanel
  ) return;

  function updateInternalDetailScrollbar() {
  detailScrollbarFrame = 0;

  if (
    !detailScrollBody ||
    !detailScrollbarRail ||
    !detailScrollbarThumb
  ) {
    return;
  }

  const visibleHeight = detailScrollBody.clientHeight;
  const fullHeight = detailScrollBody.scrollHeight;
  const maximumScroll = fullHeight - visibleHeight;

  if (maximumScroll <= 1) {
    detailScrollbarRail.classList.add("is-hidden");
    detailScrollbarThumb.style.height = "100%";
    detailScrollbarThumb.style.transform =
      "translate3d(0, 0, 0)";

    return;
  }

  detailScrollbarRail.classList.remove("is-hidden");

  const railHeight =
    detailScrollbarRail.clientHeight;

  const thumbHeight = Math.max(
    48,
    railHeight * (visibleHeight / fullHeight)
  );

  const availableMovement =
    railHeight - thumbHeight;

  const scrollProgress =
    detailScrollBody.scrollTop / maximumScroll;

  detailScrollbarThumb.style.height =
    `${thumbHeight}px`;

  detailScrollbarThumb.style.transform =
    `translate3d(
      0,
      ${availableMovement * scrollProgress}px,
      0
    )`;
}

function scheduleInternalDetailScrollbarUpdate() {
  if (detailScrollbarFrame) return;

  detailScrollbarFrame =
    requestAnimationFrame(
      updateInternalDetailScrollbar
    );
}

function setupInternalDetailScrollbar() {
  if (
    detailPanel.querySelector(
      ".skills-detail-scroll-body"
    )
  ) {
    return;
  }

  detailScrollBody =
    document.createElement("div");

  detailScrollBody.className =
    "skills-detail-scroll-body";
  const informationElements = [
    ...detailPanel.children
  ].filter(element => {
    return !element.classList.contains(
      "skills-detail-panel__glow"
    );
  });

  informationElements.forEach(element => {
    detailScrollBody.append(element);
  });

  detailScrollbarRail =
    document.createElement("div");

  detailScrollbarRail.className =
    "skills-detail-scrollbar";

  detailScrollbarRail.setAttribute(
    "aria-hidden",
    "true"
  );

  detailScrollbarThumb =
    document.createElement("span");

  detailScrollbarThumb.className =
    "skills-detail-scrollbar__thumb";

  detailScrollbarRail.append(
    detailScrollbarThumb
  );

  detailPanel.append(
    detailScrollBody,
    detailScrollbarRail
  );

  detailScrollBody.addEventListener(
    "scroll",
    scheduleInternalDetailScrollbarUpdate,
    { passive: true }
  );

  detailScrollbarRail.addEventListener(
    "pointerdown",
    event => {
      if (
        event.target ===
        detailScrollbarThumb
      ) {
        return;
      }

      const railRect =
        detailScrollbarRail
          .getBoundingClientRect();

      const clickPosition =
        event.clientY - railRect.top;

      const progress = Math.max(
        0,
        Math.min(
          1,
          clickPosition / railRect.height
        )
      );

      detailScrollBody.scrollTop =
        progress *
        (
          detailScrollBody.scrollHeight -
          detailScrollBody.clientHeight
        );
    }
  );

  /*
   * Allow the custom thumb itself to be dragged.
   */
  let draggingThumb = false;
  let dragStartY = 0;
  let dragStartScroll = 0;

  detailScrollbarThumb.addEventListener(
    "pointerdown",
    event => {
      event.preventDefault();
      event.stopPropagation();

      draggingThumb = true;
      dragStartY = event.clientY;
      dragStartScroll =
        detailScrollBody.scrollTop;

      detailScrollbarThumb
        .setPointerCapture?.(
          event.pointerId
        );
    }
  );

  detailScrollbarThumb.addEventListener(
    "pointermove",
    event => {
      if (!draggingThumb) return;

      const maximumScroll =
        detailScrollBody.scrollHeight -
        detailScrollBody.clientHeight;

      const railMovement =
        detailScrollbarRail.clientHeight -
        detailScrollbarThumb.offsetHeight;

      if (
        maximumScroll <= 0 ||
        railMovement <= 0
      ) {
        return;
      }

      const pointerMovement =
        event.clientY - dragStartY;

      detailScrollBody.scrollTop =
        dragStartScroll +
        (
          pointerMovement /
          railMovement
        ) *
        maximumScroll;
    }
  );

  function finishThumbDrag(event) {
    if (!draggingThumb) return;

    draggingThumb = false;

    if (
      detailScrollbarThumb
        .hasPointerCapture?.(
          event.pointerId
        )
    ) {
      detailScrollbarThumb
        .releasePointerCapture(
          event.pointerId
        );
    }
  }

  detailScrollbarThumb.addEventListener(
    "pointerup",
    finishThumbDrag
  );

  detailScrollbarThumb.addEventListener(
    "pointercancel",
    finishThumbDrag
  );

  if ("ResizeObserver" in window) {
    const scrollbarResizeObserver =
      new ResizeObserver(
        scheduleInternalDetailScrollbarUpdate
      );

    scrollbarResizeObserver.observe(
      detailScrollBody
    );
  }

  requestAnimationFrame(
    scheduleInternalDetailScrollbarUpdate
  );
}

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const categoryMeta = {
    technology: {
      label: "Technology",
      color: "#8b5cf6"
    },
    systems: {
      label: "Systems",
      color: "#22d3ee"
    },
    human: {
      label: "Human Skills",
      color: "#4f8cff"
    }
  };

  const state = {
    filteredSkills: [...data.skills],
    selectedId:
      data.skills.find(skill => skill.id === "web-development")?.id ||
      data.skills[0].id,
    baseRotation: 0,
    targetRotation: null,
    autoPaused: reducedMotion,
    temporaryPauseUntil: 0,
    hoveredCardId: null,
    visible: false,
    frame: 0,
    previousTime: 0,
    dragStartX: 0,
    dragStartRotation: 0,
    dragging: false,
    draggedDistance: 0,
    captureTarget: null,
    lastStageWidth: 0
  };

  const cardElements = new Map();

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function wrapAngle(angle) {
    const full = Math.PI * 2;
    return ((angle % full) + full) % full;
  }

  function shortestAngleDifference(from, to) {
    let difference = wrapAngle(to) - wrapAngle(from);
    if (difference > Math.PI) difference -= Math.PI * 2;
    if (difference < -Math.PI) difference += Math.PI * 2;
    return difference;
  }

  function categoryColor(category) {
    return categoryMeta[category]?.color || "#22d3ee";
  }

  function normalizeTool(tool) {
    if (typeof tool === "object" && tool !== null) {
      return {
        name: tool.name || "Tool",
        icon: tool.icon || null,
        color: String(tool.color || "B9C3D8").replace("#", ""),
        logoUrl: tool.logoUrl || null,
        short:
          tool.short ||
          String(tool.name || "TL")
            .replace(/[^a-z0-9+]/gi, "")
            .slice(0, 2)
            .toUpperCase()
      };
    }

    const name = String(tool);
    return {
      name,
      icon: null,
      color: "B9C3D8",
      logoUrl: null,
      short: name.replace(/[^a-z0-9+]/gi, "").slice(0, 2).toUpperCase()
    };
  }

  function uniqueToolCount() {
    const tools = new Set();

    data.skills.forEach(skill => {
      (skill.tools || []).forEach(tool => {
        tools.add(normalizeTool(tool).name.toLowerCase());
      });
    });

    return tools.size;
  }

  function selectedIndex() {
    return Math.max(
      0,
      state.filteredSkills.findIndex(skill => skill.id === state.selectedId)
    );
  }

  function stepAngle() {
    return (Math.PI * 2) / Math.max(1, state.filteredSkills.length);
  }

  function rotationForIndex(index) {
    return -index * stepAngle();
  }

  function updateMotionButton() {
    if (!motionToggle) return;

    motionToggle.setAttribute("aria-pressed", String(state.autoPaused));

    if (motionToggleIcon) {
      motionToggleIcon.textContent = state.autoPaused ? "▶" : "Ⅱ";
    }

    if (motionToggleLabel) {
      motionToggleLabel.textContent = state.autoPaused ? "Resume orbit" : "Pause orbit";
    }
  }

  function mountFiltersInsideOrbitHeader() {
    if (!orbitTopbar || !filterList || !motionToggle) return;
    if (filterList.parentElement === orbitTopbar) return;

    orbitTopbar.insertBefore(filterList, motionToggle);
  }

  function createFilters() {
    const filters = [
      { id: "all", label: "All skills" },
      { id: "technology", label: "Technology" },
      { id: "systems", label: "Systems" },
      { id: "human", label: "Human skills" }
    ];

    const fragment = document.createDocumentFragment();

    filters.forEach((filter, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "skills-filter-button interactive";
      button.dataset.filter = filter.id;
      button.textContent = filter.label;
      button.setAttribute("aria-pressed", String(index === 0));

      if (index === 0) button.classList.add("is-active");

      button.addEventListener("click", () => {
        filterList.querySelectorAll("button").forEach(item => {
          const active = item.dataset.filter === filter.id;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });

        state.filteredSkills =
          filter.id === "all"
            ? [...data.skills]
            : data.skills.filter(skill => skill.category === filter.id);

        if (!state.filteredSkills.some(skill => skill.id === state.selectedId)) {
          state.selectedId = state.filteredSkills[0]?.id || data.skills[0].id;
        }

        renderCards();
        selectSkill(state.selectedId, {
          lockToFront: true,
          pauseDuration: 4200
        });
      });

      fragment.append(button);
    });

    filterList.replaceChildren(fragment);
  }

  function createOrbitCard(skill) {
    const button = document.createElement("button");
    const color = categoryColor(skill.category);

    button.type = "button";
    button.className = "skill-orbit-card interactive";
    button.dataset.skillId = skill.id;
    button.style.setProperty("--skill-color", color);
    button.setAttribute("aria-label", `View details for ${skill.name}`);

    button.innerHTML = `
      <span class="skill-orbit-card__top">
        <span class="skill-orbit-card__symbol" aria-hidden="true">
          ${skill.symbol || skill.name.slice(0, 2).toUpperCase()}
        </span>
        <span class="skill-orbit-card__category">
          ${categoryMeta[skill.category]?.label || skill.category}
        </span>
      </span>

      <span class="skill-orbit-card__copy">
        <h3>${skill.name}</h3>
        <p>${skill.shortDescription || skill.summary}</p>
      </span>

      <span class="skill-orbit-card__select">
        <span>View details</span>
        <i aria-hidden="true">↗</i>
      </span>
    `;

button.addEventListener("click", event => {
  event.stopPropagation();
  if (state.draggedDistance > 8) return;

  selectSkill(skill.id, {
    lockToFront: true,
    pauseDuration: 6500
  });
});

    button.addEventListener("pointerenter", () => {
      state.hoveredCardId = skill.id;
    });

    button.addEventListener("pointerleave", () => {
      if (state.hoveredCardId === skill.id) {
        state.hoveredCardId = null;
      }
      startAnimation();
    });

    button.addEventListener("focus", () => {
      state.temporaryPauseUntil = performance.now() + 2500;
    });

    return button;
  }

  function renderCards() {
    state.hoveredCardId = null;
    cardElements.clear();
    const fragment = document.createDocumentFragment();

    state.filteredSkills.forEach(skill => {
      const card = createOrbitCard(skill);
      cardElements.set(skill.id, card);
      fragment.append(card);
    });

    orbitLayer.replaceChildren(fragment);

    if (visibleCount) {
      visibleCount.textContent =
        `${String(state.filteredSkills.length).padStart(2, "0")} / ` +
        `${String(data.skills.length).padStart(2, "0")}`;
    }

    if (totalIndexLabel) {
      totalIndexLabel.textContent =
        String(state.filteredSkills.length).padStart(2, "0");
    }

    updateCards(performance.now());
  }

  function createToolLogo(tool) {
    const normalized = normalizeTool(tool);
    const item = document.createElement("div");
    item.className = "skill-detail-tool";

    const logo = document.createElement("span");
    logo.className = "skill-detail-tool__logo";
    logo.setAttribute("aria-hidden", "true");

    const showFallback = () => {
      logo.replaceChildren();
      logo.textContent = normalized.short || "TL";
    };

    if (normalized.icon || normalized.logoUrl) {
      const image = document.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.referrerPolicy = "no-referrer";

      image.src = normalized.logoUrl ||
        `https://cdn.simpleicons.org/${encodeURIComponent(normalized.icon)}/${normalized.color}`;

      image.addEventListener("error", showFallback, { once: true });
      logo.append(image);
    } else {
      showFallback();
    }

    const copy = document.createElement("span");
    copy.className = "skill-detail-tool__copy";

    const name = document.createElement("strong");
    name.textContent = normalized.name;

    const descriptor = document.createElement("span");
    descriptor.textContent =
      normalized.icon || normalized.logoUrl ? "Software / platform" : "Core capability";

    copy.append(name, descriptor);
    item.append(logo, copy);

    return item;
  }

  function updateDetail(skill) {
    const index = state.filteredSkills.findIndex(item => item.id === skill.id);
    const color = categoryColor(skill.category);
    const categoryLabel = categoryMeta[skill.category]?.label || skill.category;

    detailPanel.style.setProperty("--detail-color", color);

    if (detailCode) detailCode.textContent = skill.code || "SKL";
    if (detailCategory) detailCategory.textContent = categoryLabel;
    if (detailSymbol) {
      detailSymbol.textContent =
        skill.symbol || skill.name.slice(0, 2).toUpperCase();
    }
    if (detailLevel) detailLevel.textContent = skill.strengthLabel || "Capability";
    if (detailTitle) detailTitle.textContent = skill.name;
    if (detailSummary) detailSummary.textContent = skill.summary || "";
    if (detailStrength) detailStrength.textContent = `${skill.strength || 0}%`;
    if (detailEvidence) detailEvidence.textContent = skill.evidence || "";
    if (detailToolCount) {
      const count = skill.tools?.length || 0;
      detailToolCount.textContent = `${String(count).padStart(2, "0")} ${count === 1 ? "tool" : "tools"}`;
    }

    if (detailTools) {
      const fragment = document.createDocumentFragment();
      (skill.tools || []).forEach(tool => fragment.append(createToolLogo(tool)));
      detailTools.replaceChildren(fragment);
    }

    if (detailPosition) {
      detailPosition.textContent =
        `${String(index + 1).padStart(2, "0")} / ` +
        `${String(state.filteredSkills.length).padStart(2, "0")}`;
    }

    if (currentIndexLabel) {
      currentIndexLabel.textContent =
        String(index + 1).padStart(2, "0");
    }

    if (progressBar) {
      progressBar.style.width =
        `${((index + 1) / Math.max(1, state.filteredSkills.length)) * 100}%`;
    }

    if (detailStrengthBar) {
      detailStrengthBar.style.width = "0%";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          detailStrengthBar.style.width = `${skill.strength || 0}%`;
        });
      });
    }
requestAnimationFrame(
  scheduleInternalDetailScrollbarUpdate
);
}

  function selectSkill(id, options = {}) {
    const skill = state.filteredSkills.find(item => item.id === id);
    if (!skill) return;

    state.selectedId = skill.id;
    state.draggedDistance = 0;
    updateDetail(skill);

detailScrollBody?.scrollTo({
  top: 0,
  behavior: reducedMotion
    ? "auto"
    : "smooth"
});

requestAnimationFrame(
  scheduleInternalDetailScrollbarUpdate
);

    if (options.lockToFront !== false) {
      const index = state.filteredSkills.findIndex(item => item.id === id);
      const desired = rotationForIndex(index);
      const difference = shortestAngleDifference(state.baseRotation, desired);
      state.targetRotation = state.baseRotation + difference;
    }

    if (options.pauseDuration) {
      state.temporaryPauseUntil =
        performance.now() + options.pauseDuration;
    }

    startAnimation();
  }

  function selectByOffset(offset) {
    const current = selectedIndex();
    const total = state.filteredSkills.length;
    const next = (current + offset + total) % total;

    selectSkill(state.filteredSkills[next].id, {
      lockToFront: true,
      pauseDuration: 4800
    });
  }

  function updateCards(time) {
    const count = state.filteredSkills.length;
    if (!count) return;

    const stageRect = orbitStage.getBoundingClientRect();
    const mobile = stageRect.width <= 560;
    const tablet = stageRect.width <= 820;

    const radiusX = mobile
      ? stageRect.width * .31
      : tablet
        ? stageRect.width * .34
        : stageRect.width * .35;

    const radiusY = mobile
      ? Math.min(112, stageRect.height * .25)
      : Math.min(142, stageRect.height * .28);

    const step = stepAngle();

    state.filteredSkills.forEach((skill, index) => {
      const card = cardElements.get(skill.id);
      if (!card) return;

      const angle = state.baseRotation + index * step;
      const sine = Math.sin(angle);
      const cosine = Math.cos(angle);
      const depth = (cosine + 1) / 2;

      const x = sine * radiusX;
      const y = cosine * radiusY * .66;
      const z = (depth - .5) * 270;

      const scale = mobile
        ? .72 + depth * .28
        : .7 + depth * .31;

      const opacity = .24 + depth * .76;
      const blur = (1 - depth) * (mobile ? .8 : 1.5);
      const selected = skill.id === state.selectedId;

      card.style.transform =
        `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) ` +
        `scale(${scale + (selected ? .025 : 0)})`;

      card.style.opacity = String(opacity);
      card.style.filter = `blur(${blur}px) saturate(${.68 + depth * .42})`;
      card.style.zIndex = String(10 + Math.round(depth * 100));
      card.style.pointerEvents = depth < .18 ? "none" : "auto";
      card.dataset.depth = depth.toFixed(3);
    });
  }

  function shouldAutoRotate(time) {
    return (
      !state.autoPaused &&
      !reducedMotion &&
      !state.hoveredCardId &&
      !state.dragging &&
      time > state.temporaryPauseUntil &&
      state.targetRotation === null
    );
  }

  function animate(time) {
    state.frame = 0;

    const delta = state.previousTime
      ? Math.min(38, time - state.previousTime)
      : 16;

    state.previousTime = time;

    if (state.targetRotation !== null) {
      const difference = state.targetRotation - state.baseRotation;
      state.baseRotation += difference * Math.min(1, delta * .021);

      if (Math.abs(difference) < .0012) {
        state.baseRotation = state.targetRotation;
        state.targetRotation = null;
      }
    } else if (shouldAutoRotate(time)) {
      // About 48 seconds for one calm complete rotation.
      state.baseRotation += delta * .000131;
    }

    updateCards(time);

    if (state.visible || state.targetRotation !== null || state.dragging) {
      state.frame = requestAnimationFrame(animate);
    }
  }

  function startAnimation() {
    if (state.frame) return;
    state.previousTime = 0;
    state.frame = requestAnimationFrame(animate);
  }

  function stopAnimation() {
    if (!state.frame) return;
    cancelAnimationFrame(state.frame);
    state.frame = 0;
  }

  function pointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;

    state.dragging = true;
    state.dragStartX = event.clientX;
    state.dragStartRotation = state.baseRotation;
    state.draggedDistance = 0;
    state.targetRotation = null;
    state.temporaryPauseUntil = performance.now() + 1500;

    const card = event.target.closest?.(".skill-orbit-card");

    state.captureTarget = card || orbitStage;
    state.captureTarget.setPointerCapture?.(event.pointerId);
    startAnimation();
  }

  function pointerMove(event) {
    if (!state.dragging) return;

    const distance = event.clientX - state.dragStartX;
    state.draggedDistance = Math.max(state.draggedDistance, Math.abs(distance));
    state.baseRotation =
      state.dragStartRotation + distance * .0055;

    updateCards(performance.now());
  }

  function pointerUp(event) {
    if (!state.dragging) return;

    state.dragging = false;
    orbitStage.releasePointerCapture?.(event.pointerId);

    const distance = event.clientX - state.dragStartX;

    if (Math.abs(distance) > 46) {
      selectByOffset(distance > 0 ? -1 : 1);
    } else {
      state.temporaryPauseUntil = performance.now() + 1200;
    }
  }

  orbitStage.addEventListener("pointerdown", pointerDown);
  orbitStage.addEventListener("pointermove", pointerMove);
  orbitStage.addEventListener("pointerup", pointerUp);
  orbitStage.addEventListener("pointercancel", pointerUp);

  orbitStage.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectByOffset(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectByOffset(1);
    }

    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      state.autoPaused = !state.autoPaused;
      updateMotionButton();
      startAnimation();
    }
  });

  previousButton?.addEventListener("click", () => selectByOffset(-1));
  nextButton?.addEventListener("click", () => selectByOffset(1));

  motionToggle?.addEventListener("click", () => {
    state.autoPaused = !state.autoPaused;
    state.temporaryPauseUntil = 0;
    updateMotionButton();
    startAnimation();
  });

  if (introduction && data.introduction) {
    introduction.textContent = data.introduction;
  }

  if (totalCount) {
    totalCount.textContent =
      String(data.skills.length).padStart(2, "0");
  }

  if (toolCount) {
    const count = uniqueToolCount();
    toolCount.textContent =
      count >= 20 ? `${count}+` : String(count).padStart(2, "0");
  }

  setupInternalDetailScrollbar();
  createFilters();
  mountFiltersInsideOrbitHeader();
  renderCards();
  updateMotionButton();

  const initialIndex = selectedIndex();
  state.baseRotation = rotationForIndex(initialIndex);
  selectSkill(state.selectedId, {
    lockToFront: false
  });

  /* Top-screen focus blur */

const skillsTopBlur =
  document.createElement("div");

skillsTopBlur.className =
  "skills-top-focus-blur";

skillsTopBlur.setAttribute(
  "aria-hidden",
  "true"
);

document.body.append(skillsTopBlur);

if (skillsShowcase) {
  const skillsFocusObserver =
    new IntersectionObserver(
      entries => {
        const entry = entries[0];

        skillsTopBlur.classList.toggle(
          "is-visible",
          Boolean(entry?.isIntersecting)
        );
      },
      {
        threshold: 0.05,

        /*
         * Activates when the spinning showcase occupies
         * the upper and middle part of the screen.
         */
        rootMargin:
          "-8% 0px -48% 0px"
      }
    );

  skillsFocusObserver.observe(
    skillsShowcase
  );
}

  const visibilityObserver = new IntersectionObserver(entries => {
    const entry = entries[0];
    state.visible = Boolean(entry?.isIntersecting);
    section.classList.toggle("is-visible", state.visible);

    if (state.visible) {
      startAnimation();
    } else {
      stopAnimation();
    }
  }, {
    threshold: .08,
    rootMargin: "7% 0px 7% 0px"
  });

  visibilityObserver.observe(section);

  const resizeObserver = new ResizeObserver(() => {
    updateCards(performance.now());
  });

  resizeObserver.observe(orbitStage);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopAnimation();
    } else if (state.visible) {
      startAnimation();
    }
  });

  window.addEventListener("portfolio:intro-complete", () => {
    updateCards(performance.now());
    if (state.visible) startAnimation();
  });
})();
