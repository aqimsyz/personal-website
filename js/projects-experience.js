(() => {
  "use strict";

  const projectData = window.PORTFOLIO_PROJECTS;
  const credentialData = window.PORTFOLIO_CREDENTIALS || { certificates: [], categories: [] };
  const badgeData = window.PORTFOLIO_BADGES || { badges: [], domains: [] };
  const root = document.querySelector("#projects.projects-module");

  if (!root || !projectData?.projects?.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const projectCategoryMap = Object.fromEntries(
    (projectData.categories || []).map(item => [item.id, item.label])
  );

  const certificateCategoryMap = Object.fromEntries(
    (credentialData.categories || []).map(item => [item.id, item.label])
  );

  const state = {
    projectFilter: "all",
    selectedProjectId:
      projectData.projects.some(project => project.id === projectData.featuredId)
        ? projectData.featuredId
        : projectData.projects[0].id,
    visualIndex: 0,
    certificateFilter: "all",
    selectedCertificateId:
      credentialData.certificates?.some(item => item.id === credentialData.featuredId)
        ? credentialData.featuredId
        : credentialData.certificates?.[0]?.id || null,
    selectedBadgeId: badgeData.badges?.[0]?.id || null,
    badgeFilter: "all",
    stageFrame: 0,
    stagePointerX: 0,
    stagePointerY: 0,
    visualDragPointerId: null,
    visualDragStartX: 0,
    visualDragStartY: 0,
    visualDragLastX: 0,
    visualDragStartedAt: 0,
    visualDragStartScroll: 0,
    visualDragStartIndex: 0,
    visualScrollFrame: 0,
    projectDialogTrigger: null
  };

  const visualAutoplay = {
    timer: 0,
    resumeTimer: 0,
    hovered: false,
    dragging: false
  };

  const elements = {
    introduction: root.querySelector("#projects-introduction"),
    totalCount: root.querySelector("#projects-total-count"),
    domainCount: root.querySelector("#projects-domain-count"),
    toolCount: root.querySelector("#projects-tool-count"),
    showroomCount: root.querySelector("#project-showroom-count"),
    projectPosition: root.querySelector("#project-position"),
    projectFilters: root.querySelector("#project-filters"),
    cardGrid: root.querySelector("#project-card-grid"),
    showroom: root.querySelector(".project-showroom"),
    showroomToolbar: root.querySelector(".project-showroom__toolbar"),
    showroomMain: root.querySelector(".project-showroom__main"),
    projectIndex: root.querySelector(".project-index"),
    projectIndexHeading: root.querySelector(".project-index__heading"),
    visualStage: root.querySelector("#project-visual-stage"),
    screenStack: root.querySelector(".project-screen-stack"),
    sliderBackdropImage: null,
    screenMain: root.querySelector("#project-screen-main"),
    screenBack: root.querySelector("#project-screen-back"),
    screenFloat: root.querySelector("#project-screen-float"),
    screenMainFrame: root.querySelector(".project-screen--main"),
    visualDots: root.querySelector("#project-visual-dots"),
    visualLabel: root.querySelector("#project-visual-label"),
    visualTotal: root.querySelector("#project-visual-total"),
    browserLabel: root.querySelector("#project-browser-label"),
    hudCode: root.querySelector("#project-hud-code"),
    detailCode: root.querySelector("#project-detail-code"),
    detailCategory: root.querySelector("#project-detail-category"),
    detailStatus: root.querySelector("#project-detail-status"),
    detailNumber: root.querySelector("#project-detail-number"),
    detailTitle: root.querySelector("#project-detail-title"),
    detailSubtitle: root.querySelector("#project-detail-subtitle"),
    detailSummary: root.querySelector("#project-detail-summary"),
    detailContribution: root.querySelector("#project-detail-contribution"),
    detailFeatures: root.querySelector("#project-detail-features"),
    detailTools: root.querySelector("#project-detail-tools"),
    detailToolCount: root.querySelector("#project-detail-tool-count"),
    detailOutcome: root.querySelector("#project-detail-outcome"),
    certificateCount: root.querySelector("#certificate-count"),
    badgeCount: root.querySelector("#badge-count"),
    credentialDomainCount: root.querySelector("#credential-domain-count"),
    certificateFilters: root.querySelector("#certificate-filters"),
    certificateGrid: root.querySelector("#certificate-grid"),
    certificateFeatureImage: root.querySelector("#certificate-feature-image"),
    certificateFeatureVisual: root.querySelector(".certificate-feature__visual"),
    certificateFeatureCategory: root.querySelector("#certificate-feature-category"),
    certificateFeatureTitle: root.querySelector("#certificate-feature-title"),
    certificateFeatureIssuer: root.querySelector("#certificate-feature-issuer"),
    certificateFeatureStatus: root.querySelector("#certificate-feature-status"),
    certificateFeaturePosition: root.querySelector("#certificate-feature-position"),
    certificateViewButton: root.querySelector("#certificate-view-button"),
    badgePassportStatus: root.querySelector("#badge-passport-status"),
    badgeFeature: root.querySelector("#badge-feature"),
    badgeFeatureTitle: root.querySelector("#badge-feature-title"),
    badgeFeatureDescription: root.querySelector("#badge-feature-description"),
    badgeDomainList: root.querySelector("#badge-domain-list"),
    badgeGrid: root.querySelector("#badge-grid"),
    certificateDialog: root.querySelector("#certificate-dialog"),
    certificateDialogClose: root.querySelector("#certificate-dialog-close"),
    certificateDialogImage: root.querySelector("#certificate-dialog-image"),
    certificateDialogCategory: root.querySelector("#certificate-dialog-category"),
    certificateDialogTitle: root.querySelector("#certificate-dialog-title"),
    certificateDialogIssuer: root.querySelector("#certificate-dialog-issuer"),
    certificateDialogStatus: root.querySelector("#certificate-dialog-status"),
    projectDialog: null,
    projectDialogClose: null
  };

  const pad = value => String(value).padStart(2, "0");

  function safeText(element, value) {
    if (element) element.textContent = value ?? "";
  }

  function simpleIconUrl(tool) {
    if (tool.logoUrl) return tool.logoUrl;
    if (!tool.icon) return "";
    return `https://cdn.simpleicons.org/${tool.icon}/${tool.color || "FFFFFF"}`;
  }

  function uniqueToolCount() {
    return new Set(
      projectData.projects.flatMap(project =>
        (project.tools || []).map(tool => tool.name.toLowerCase())
      )
    ).size;
  }

  function filteredProjects() {
    if (state.projectFilter === "all") return projectData.projects;
    return projectData.projects.filter(project => project.category === state.projectFilter);
  }

  function selectedProject() {
    return (
      projectData.projects.find(project => project.id === state.selectedProjectId) ||
      projectData.projects[0]
    );
  }

  function selectedCertificate() {
    return (
      credentialData.certificates?.find(item => item.id === state.selectedCertificateId) ||
      credentialData.certificates?.[0] ||
      null
    );
  }

  function selectedBadge() {
    return badgeData.badges?.find(item => item.id === state.selectedBadgeId) || null;
  }

  function setProjectTheme(project) {
    root.style.setProperty("--project-accent", project.accent || "#4fe0bc");
    root.style.setProperty("--project-accent-2", project.accent2 || "#8b5cf6");
  }

  function createToolElement(tool) {
    const item = document.createElement("div");
    item.className = "project-tool";
    item.style.setProperty("--tool-color", `#${tool.color || "4fe0bc"}`);
    item.title = tool.name;

    const icon = document.createElement("span");
    icon.className = "project-tool__icon";

    const logoSource = simpleIconUrl(tool);
    if (logoSource) {
      const image = document.createElement("img");
      image.src = logoSource;
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener(
        "error",
        () => {
          image.remove();
          icon.textContent = tool.short || tool.name.slice(0, 2).toUpperCase();
        },
        { once: true }
      );
      icon.append(image);
    } else {
      icon.textContent = tool.short || tool.name.slice(0, 2).toUpperCase();
    }

    const label = document.createElement("span");
    label.textContent = tool.name;

    item.append(icon, label);
    return item;
  }

  function createProjectFilter(category) {
    const button = document.createElement("button");
    button.className = "project-filter";
    button.type = "button";
    button.dataset.filter = category.id;
    button.textContent = category.label;
    button.classList.toggle("is-active", category.id === state.projectFilter);
    button.setAttribute("aria-pressed", String(category.id === state.projectFilter));
    button.addEventListener("click", () => setProjectFilter(category.id));
    return button;
  }

  function renderProjectFilters() {
    if (!elements.projectFilters) return;
    elements.projectFilters.replaceChildren(
      ...(projectData.categories || []).map(createProjectFilter)
    );
  }

  function createProjectCard(project) {
    const button = document.createElement("button");
    button.className = "project-card";
    button.type = "button";
    button.dataset.projectId = project.id;
    button.dataset.category = project.category;
    button.style.setProperty("--card-accent", project.accent || "#4fe0bc");
    button.setAttribute("role", "listitem");
    button.setAttribute(
      "aria-label",
      `View ${project.title}, ${project.subtitle}`
    );

    const imageWrap = document.createElement("span");
    imageWrap.className = "project-card__image";
    const image = document.createElement("img");
    image.src = project.thumbnail || project.images?.[0] || "";
    image.alt = "";
    image.loading = "lazy";
    imageWrap.append(image);

    const content = document.createElement("span");
    content.className = "project-card__content";

    const top = document.createElement("span");
    top.className = "project-card__top";

    const number = document.createElement("span");
    number.className = "project-card__number";
    number.textContent = `${project.code} / ${project.number}`;

    const category = document.createElement("span");
    category.className = "project-card__category";
    category.textContent = projectCategoryMap[project.category] || project.category;
    top.append(number, category);

    const bottom = document.createElement("span");
    bottom.className = "project-card__bottom";

    const copy = document.createElement("span");
    copy.style.minWidth = "0";

    const title = document.createElement("strong");
    title.className = "project-card__title";
    title.textContent = project.title;

    const subtitle = document.createElement("small");
    subtitle.className = "project-card__subtitle";
    subtitle.textContent = project.subtitle;

    const select = document.createElement("span");
    select.className = "project-card__select";
    select.setAttribute("aria-hidden", "true");
    select.innerHTML = `
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="M5 12h13"></path>
        <path d="m13 6 6 6-6 6"></path>
      </svg>
    `;

    copy.append(title, subtitle);
    bottom.append(copy, select);
    content.append(top, bottom);
    button.append(imageWrap, content);

    button.addEventListener("click", () => {
      selectProject(project.id, { openDialog: true, trigger: button });
    });

    button.addEventListener("keydown", event => handleProjectCardKeyboard(event, project.id));
    return button;
  }

  function renderProjectCards() {
    if (!elements.cardGrid) return;
    elements.cardGrid.replaceChildren(...projectData.projects.map(createProjectCard));
    syncProjectCards();
  }

  function syncProjectCards() {
    const visibleIds = new Set(filteredProjects().map(project => project.id));
    root.querySelectorAll(".project-card").forEach(card => {
      const isVisible = visibleIds.has(card.dataset.projectId);
      const isSelected = card.dataset.projectId === state.selectedProjectId;
      card.hidden = !isVisible;
      card.classList.toggle("is-selected", isSelected);
      card.setAttribute("aria-current", isSelected ? "true" : "false");
    });
  }

  function setProjectFilter(filterId) {
    state.projectFilter = filterId;

    root.querySelectorAll(".project-filter").forEach(button => {
      const active = button.dataset.filter === filterId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const visible = filteredProjects();
    if (!visible.some(project => project.id === state.selectedProjectId) && visible[0]) {
      state.selectedProjectId = visible[0].id;
      state.visualIndex = 0;
      updateSelectedProject();
    }

    syncProjectCards();
    safeText(
      elements.showroomCount,
      `${pad(visible.length)} ${visible.length === 1 ? "PROJECT" : "PROJECTS"} ONLINE`
    );
  }

  function handleProjectCardKeyboard(event, projectId) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;

    const projects = filteredProjects();
    const index = projects.findIndex(project => project.id === projectId);
    if (index < 0) return;

    event.preventDefault();

    let nextIndex = index;
    if (event.key === "ArrowLeft") nextIndex = (index - 1 + projects.length) % projects.length;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % projects.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = projects.length - 1;

    const next = projects[nextIndex];
    selectProject(next.id, { openDialog: false });
    root.querySelector(`.project-card[data-project-id="${next.id}"]`)?.focus();
  }

  function preloadProjectImages(project) {
    (project.images || []).forEach(source => {
      const image = new Image();
      image.src = source;
    });
  }

  function projectVisuals(project) {
    const images = (project.images || []).filter(Boolean);
    if (images.length) return images;
    return project.thumbnail ? [project.thumbnail] : [];
  }

  function ensureSliderBackdrop() {
    if (!elements.visualStage) return null;

    let backdrop = elements.visualStage.querySelector(".project-slider-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "project-slider-backdrop";
      backdrop.setAttribute("aria-hidden", "true");

      const image = document.createElement("img");
      image.alt = "";
      image.draggable = false;
      backdrop.append(image);

      elements.visualStage.insertBefore(
        backdrop,
        elements.screenStack || elements.visualStage.firstChild
      );
    }

    elements.sliderBackdropImage = backdrop.querySelector("img");
    return elements.sliderBackdropImage;
  }

  function createProjectSlide(project, source, index, total) {
    const slide = document.createElement("figure");
    slide.className = "project-slider-slide";
    slide.dataset.visualIndex = String(index);
    slide.setAttribute(
      "aria-label",
      `${project.title} visual ${index + 1} of ${total}`
    );
    slide.setAttribute("aria-hidden", "true");

    const chrome = document.createElement("div");
    chrome.className = "project-slider-slide__chrome";
    chrome.setAttribute("aria-hidden", "true");
    chrome.innerHTML = `
      <span></span><span></span><span></span>
      <strong>${project.title} / VISUAL ${pad(index + 1)}</strong>
    `;

    const canvas = document.createElement("div");
    canvas.className = "project-slider-slide__canvas";
    canvas.style.setProperty(
      "--slide-image",
      `url(${JSON.stringify(String(source))})`
    );

    const image = document.createElement("img");
    image.src = source;
    image.alt = `${project.title} — ${project.subtitle}, visual ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.draggable = false;
    image.addEventListener("dragstart", event => event.preventDefault());
    canvas.append(image);

    const caption = document.createElement("figcaption");
    caption.innerHTML = `
      <span>VIEW ${pad(index + 1)}</span>
      <strong>${pad(total)} VISUALS</strong>
    `;

    slide.append(chrome, canvas, caption);
    return slide;
  }

  function nearestSliderIndex() {
    const viewport = elements.screenStack;
    if (!viewport) return state.visualIndex;

    const slides = [...viewport.querySelectorAll(".project-slider-slide")];
    if (!slides.length) return 0;

    const centre = viewport.scrollLeft + viewport.clientWidth / 2;
    let nearest = 0;
    let distance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const slideCentre = slide.offsetLeft + slide.offsetWidth / 2;
      const nextDistance = Math.abs(slideCentre - centre);
      if (nextDistance < distance) {
        distance = nextDistance;
        nearest = index;
      }
    });

    return nearest;
  }

  function syncSliderState(project, index) {
    const images = projectVisuals(project);
    if (!images.length) return;

    const safeIndex = ((index % images.length) + images.length) % images.length;
    state.visualIndex = safeIndex;

    elements.screenStack
      ?.querySelectorAll(".project-slider-slide")
      .forEach((slide, slideIndex) => {
        const active = slideIndex === safeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", String(!active));
      });

    root.querySelectorAll(".project-visual-dot").forEach((dot, dotIndex) => {
      const active = dotIndex === safeIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-pressed", String(active));
    });

    safeText(elements.visualLabel, `INTERFACE ${pad(safeIndex + 1)}`);
    safeText(elements.visualTotal, `${pad(images.length)} VISUALS`);

    const backdropImage = ensureSliderBackdrop();
    if (backdropImage && backdropImage.src !== new URL(images[safeIndex], document.baseURI).href) {
      backdropImage.classList.add("is-changing");
      backdropImage.src = images[safeIndex];
      requestAnimationFrame(() => backdropImage.classList.remove("is-changing"));
    }
  }

  function scrollToProjectVisual(index, { behavior = "smooth" } = {}) {
    const project = selectedProject();
    const images = projectVisuals(project);
    const viewport = elements.screenStack;
    if (!viewport || !images.length) return;

    const safeIndex = ((index % images.length) + images.length) % images.length;
    const slide = viewport.querySelector(
      `.project-slider-slide[data-visual-index="${safeIndex}"]`
    );

    syncSliderState(project, safeIndex);
    if (!slide || viewport.clientWidth <= 0) return;

    const left = slide.offsetLeft - (viewport.clientWidth - slide.offsetWidth) / 2;
    viewport.scrollTo({
      left: Math.max(0, left),
      behavior: reducedMotion ? "auto" : behavior
    });
  }

  function assignVisualImages(project, { behavior = "auto" } = {}) {
    const viewport = elements.screenStack;
    const images = projectVisuals(project);
    if (!viewport || !images.length) return;

    const needsRender =
      viewport.dataset.projectId !== project.id ||
      viewport.querySelectorAll(".project-slider-slide").length !== images.length;

    if (needsRender) {
      viewport.dataset.projectId = project.id;
      viewport.replaceChildren(
        ...images.map((source, index) =>
          createProjectSlide(project, source, index, images.length)
        )
      );
      viewport.scrollLeft = 0;
    }

    const safeIndex = ((state.visualIndex % images.length) + images.length) % images.length;
    syncSliderState(project, safeIndex);

    requestAnimationFrame(() => {
      scrollToProjectVisual(safeIndex, { behavior: needsRender ? "auto" : behavior });
    });
  }

  function renderVisualDots(project) {
    if (!elements.visualDots) return;

    const images = projectVisuals(project);
    const buttons = images.map((_, index) => {
      const button = document.createElement("button");
      button.className = "project-visual-dot";
      button.type = "button";
      button.setAttribute("aria-label", `Show visual ${index + 1} of ${images.length}`);
      button.setAttribute("aria-pressed", String(index === state.visualIndex));
      button.classList.toggle("is-active", index === state.visualIndex);
      button.addEventListener("click", () => {
        scrollToProjectVisual(index);
        restartProjectVisualAutoplay(1200);
      });
      return button;
    });

    elements.visualDots.replaceChildren(...buttons);
  }

  function updateProjectDetails(project) {
    const allIndex = projectData.projects.findIndex(item => item.id === project.id);
    const visible = filteredProjects();
    const visibleIndex = visible.findIndex(item => item.id === project.id);

    safeText(elements.projectPosition, `${pad(visibleIndex + 1)} / ${pad(visible.length)}`);
    safeText(elements.browserLabel, `${project.title} / INTERFACE VIEW`);
    safeText(elements.hudCode, project.code);
    safeText(elements.detailCode, project.code);
    safeText(elements.detailCategory, projectCategoryMap[project.category] || project.category);
    safeText(elements.detailStatus, project.status);
    safeText(elements.detailNumber, `PROJECT ${project.number}`);
    safeText(elements.detailTitle, project.title);
    safeText(elements.detailSubtitle, project.subtitle);
    safeText(elements.detailSummary, project.summary);
    safeText(elements.detailContribution, project.contribution);
    safeText(elements.detailOutcome, project.outcome);
    safeText(elements.detailToolCount, `${pad(project.tools?.length || 0)} TOOLS`);

    if (elements.detailFeatures) {
      elements.detailFeatures.replaceChildren(
        ...(project.features || []).slice(0, 3).map(feature => {
          const item = document.createElement("span");
          item.className = "project-detail-feature";
          item.textContent = feature;
          return item;
        })
      );
    }

    if (elements.detailTools) {
      elements.detailTools.replaceChildren(...(project.tools || []).map(createToolElement));
    }

    const nextProject = projectData.projects[(allIndex + 1) % projectData.projects.length];
    if (nextProject) preloadProjectImages(nextProject);
  }

  function updateSelectedProject() {
    const project = selectedProject();
    setProjectTheme(project);
    renderVisualDots(project);
    assignVisualImages(project);
    updateProjectDetails(project);
    syncProjectCards();
  }

  function selectProject(projectId, { openDialog = false, trigger = null } = {}) {
    if (!projectData.projects.some(project => project.id === projectId)) return;
    state.selectedProjectId = projectId;
    state.visualIndex = 0;
    updateSelectedProject();

    if (openDialog) openProjectDialog(trigger);
  }

  function setupProjectIndexExperience() {
    root.classList.add("projects-popup-mode");

    const headingTitle = elements.projectIndexHeading?.querySelector("strong");
    const headingHint = elements.projectIndexHeading?.querySelector("p");

    safeText(headingTitle, "Choose a project to explore.");

    if (headingHint) {
      headingHint.remove();
    }

    if (elements.projectFilters && elements.projectIndex) {
      const filterDock = document.createElement("div");
      filterDock.className = "project-index__filters";
      filterDock.setAttribute("aria-label", "Project category filters");
      filterDock.append(elements.projectFilters);
      elements.projectIndexHeading?.insertAdjacentElement("afterend", filterDock);
    }
  }

  function createDialogCloseButton(className, label) {
    const button = document.createElement("button");
    button.className = className;
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = "<span></span><span></span>";
    return button;
  }

  function setupProjectDialog() {
    if (!elements.showroomMain || elements.projectDialog) return;

    const dialog = document.createElement("dialog");
    dialog.id = "project-dialog";
    dialog.className = "project-dialog";
    dialog.setAttribute("aria-labelledby", "project-detail-title");
    dialog.setAttribute("aria-describedby", "project-detail-summary");

    const frame = document.createElement("div");
    frame.className = "project-dialog__frame";

    const chrome = document.createElement("header");
    chrome.className = "project-dialog__chrome";
    chrome.innerHTML = `
      <div class="project-dialog__mode">
        <i aria-hidden="true"></i>
        <span>FOCUSED PROJECT VIEW</span>
      </div>
      <small>SELECTED WORK / DETAILS</small>
    `;

    const closeButton = createDialogCloseButton(
      "project-dialog__close",
      "Close project preview"
    );

    const viewport = document.createElement("div");
    viewport.className = "project-dialog__viewport";
    viewport.append(elements.showroomMain);

    frame.append(chrome, closeButton, viewport);
    dialog.append(frame);
    root.append(dialog);

    elements.projectDialog = dialog;
    elements.projectDialogClose = closeButton;

    closeButton.addEventListener("click", closeProjectDialog);

    dialog.addEventListener("cancel", event => {
      event.preventDefault();
      closeProjectDialog();
    });

    dialog.addEventListener("click", event => {
      if (event.target !== dialog) return;
      closeProjectDialog();
    });

    dialog.addEventListener("close", () => {
      clearProjectVisualAutoplay();
      document.documentElement.classList.remove("is-project-dialog-open");
      const trigger = state.projectDialogTrigger;
      state.projectDialogTrigger = null;
      trigger?.focus?.({ preventScroll: true });
    });
  }

  function openProjectDialog(trigger) {
    const dialog = elements.projectDialog;
    if (!dialog) return;

    state.projectDialogTrigger = trigger || document.activeElement;
    document.documentElement.classList.add("is-project-dialog-open");

    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    requestAnimationFrame(() => {
      dialog.classList.add("is-ready");
      requestAnimationFrame(() => {
        scrollToProjectVisual(state.visualIndex, { behavior: "auto" });
        restartProjectVisualAutoplay(1200);
      });
      elements.projectDialogClose?.focus({ preventScroll: true });
    });
  }

  function closeProjectDialog() {
    const dialog = elements.projectDialog;
    if (!dialog) return;

    clearProjectVisualAutoplay();
    dialog.classList.remove("is-ready");

    if (typeof dialog.close === "function") {
      if (dialog.open) dialog.close();
    } else {
      dialog.removeAttribute("open");
      document.documentElement.classList.remove("is-project-dialog-open");
      const trigger = state.projectDialogTrigger;
      state.projectDialogTrigger = null;
      trigger?.focus?.({ preventScroll: true });
    }
  }

  function stepProjectVisual(direction) {
    const project = selectedProject();
    const images = projectVisuals(project);
    if (images.length < 2) return;

    scrollToProjectVisual(state.visualIndex + direction);
  }

  function clearProjectVisualAutoplay() {
    window.clearTimeout(visualAutoplay.timer);
    window.clearTimeout(visualAutoplay.resumeTimer);
    visualAutoplay.timer = 0;
    visualAutoplay.resumeTimer = 0;
  }

  function projectVisualAutoplayAllowed() {
    const dialogOpen = Boolean(elements.projectDialog?.open || elements.projectDialog?.hasAttribute("open"));
    return (
      !reducedMotion &&
      !document.hidden &&
      dialogOpen &&
      !visualAutoplay.dragging &&
      projectVisuals(selectedProject()).length > 1
    );
  }

  function scheduleProjectVisualAutoplay(delay = 3000) {
    window.clearTimeout(visualAutoplay.timer);
    visualAutoplay.timer = 0;

    if (!projectVisualAutoplayAllowed()) return;

    visualAutoplay.timer = window.setTimeout(() => {
      visualAutoplay.timer = 0;
      if (!projectVisualAutoplayAllowed()) return;

      stepProjectVisual(1);
      scheduleProjectVisualAutoplay(3000);
    }, delay);
  }

  function restartProjectVisualAutoplay(delay = 1200) {
    window.clearTimeout(visualAutoplay.timer);
    window.clearTimeout(visualAutoplay.resumeTimer);
    visualAutoplay.timer = 0;
    visualAutoplay.resumeTimer = 0;

    visualAutoplay.resumeTimer = window.setTimeout(() => {
      visualAutoplay.resumeTimer = 0;
      scheduleProjectVisualAutoplay(3000);
    }, delay);
  }

  function setupVisualDrag() {
    const viewport = elements.screenStack;
    if (!viewport) return;

    ensureSliderBackdrop();

    const scheduleScrollSync = () => {
      if (state.visualScrollFrame) return;
      state.visualScrollFrame = requestAnimationFrame(() => {
        state.visualScrollFrame = 0;
        syncSliderState(selectedProject(), nearestSliderIndex());
      });
    };

    viewport.addEventListener("scroll", scheduleScrollSync, { passive: true });

    viewport.addEventListener("pointerdown", event => {
      if (event.target.closest("button, a")) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;

      state.visualDragPointerId = event.pointerId;
      state.visualDragStartX = event.clientX;
      state.visualDragStartY = event.clientY;
      state.visualDragLastX = event.clientX;
      state.visualDragStartedAt = performance.now();
      state.visualDragStartScroll = viewport.scrollLeft;
      state.visualDragStartIndex = state.visualIndex;
      visualAutoplay.dragging = true;
      clearProjectVisualAutoplay();

      viewport.classList.add("is-dragging");
      viewport.setPointerCapture?.(event.pointerId);
    });

    viewport.addEventListener("pointermove", event => {
      if (event.pointerId !== state.visualDragPointerId) return;

      const deltaX = event.clientX - state.visualDragStartX;
      const deltaY = event.clientY - state.visualDragStartY;
      state.visualDragLastX = event.clientX;

      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 4) {
        event.preventDefault();
        viewport.scrollLeft = state.visualDragStartScroll - deltaX;
      }
    });

    const finishDrag = event => {
      if (event.pointerId !== state.visualDragPointerId) return;

      const deltaX = state.visualDragLastX - state.visualDragStartX;
      const elapsed = Math.max(1, performance.now() - state.visualDragStartedAt);
      const velocity = Math.abs(deltaX) / elapsed;

      if (viewport.hasPointerCapture?.(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      viewport.classList.remove("is-dragging");
      state.visualDragPointerId = null;
      visualAutoplay.dragging = false;

      let targetIndex = nearestSliderIndex();
      if (Math.abs(deltaX) >= 54 || velocity >= .5) {
        targetIndex = state.visualDragStartIndex + (deltaX < 0 ? 1 : -1);
      }

      scrollToProjectVisual(targetIndex);
      restartProjectVisualAutoplay(1200);
    };

    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);
    viewport.addEventListener("lostpointercapture", event => {
      if (event.pointerId !== state.visualDragPointerId) return;
      viewport.classList.remove("is-dragging");
      state.visualDragPointerId = null;
      visualAutoplay.dragging = false;
      scrollToProjectVisual(nearestSliderIndex());
      restartProjectVisualAutoplay(1200);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearProjectVisualAutoplay();
      } else {
        restartProjectVisualAutoplay(1200);
      }
    });

    elements.projectDialog?.addEventListener("keydown", event => {
      if (event.target.closest("button, a, input, textarea, select")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        stepProjectVisual(-1);
        restartProjectVisualAutoplay(1200);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        stepProjectVisual(1);
        restartProjectVisualAutoplay(1200);
      }
    });
  }

  function setupStageMotion() {
    if (!elements.visualStage) return;
    elements.visualStage.style.setProperty("--stage-rotate-x", "0deg");
    elements.visualStage.style.setProperty("--stage-rotate-y", "0deg");
  }

  function filteredCertificates() {
    if (state.certificateFilter === "all") return credentialData.certificates || [];
    return (credentialData.certificates || []).filter(
      certificate => certificate.category === state.certificateFilter
    );
  }

  function createCertificateFilter(category) {
    const button = document.createElement("button");
    button.className = "certificate-filter";
    button.type = "button";
    button.dataset.filter = category.id;
    button.textContent = category.label;
    button.classList.toggle("is-active", category.id === state.certificateFilter);
    button.setAttribute("aria-pressed", String(category.id === state.certificateFilter));
    button.addEventListener("click", () => setCertificateFilter(category.id));
    return button;
  }

  function renderCertificateFilters() {
    if (!elements.certificateFilters) return;
    elements.certificateFilters.replaceChildren(
      ...(credentialData.categories || []).map(createCertificateFilter)
    );
  }

  function createCertificateCard(certificate) {
    const button = document.createElement("button");
    button.className = "certificate-card";
    button.type = "button";
    button.dataset.certificateId = certificate.id;
    button.dataset.category = certificate.category;
    button.setAttribute("role", "listitem");
    button.setAttribute("aria-label", `Select ${certificate.title}`);

    const imageWrap = document.createElement("span");
    imageWrap.className = "certificate-card__image";
    const image = document.createElement("img");
    image.src = certificate.image;
    image.alt = "";
    image.loading = "lazy";
    imageWrap.append(image);

    const copy = document.createElement("span");
    copy.className = "certificate-card__copy";
    const category = document.createElement("span");
    category.textContent = certificateCategoryMap[certificate.category] || certificate.category;
    const title = document.createElement("strong");
    title.textContent = certificate.title;
    const issuer = document.createElement("small");
    issuer.textContent = certificate.issuer;
    copy.append(category, title, issuer);

    button.append(imageWrap, copy);
    button.addEventListener("click", () => selectCertificate(certificate.id));
    return button;
  }

  function renderCertificateCards() {
    if (!elements.certificateGrid) return;
    elements.certificateGrid.replaceChildren(
      ...(credentialData.certificates || []).map(createCertificateCard)
    );
    syncCertificateCards();
  }

  function syncCertificateCards() {
    const visibleIds = new Set(filteredCertificates().map(item => item.id));
    root.querySelectorAll(".certificate-card").forEach(card => {
      const visible = visibleIds.has(card.dataset.certificateId);
      const selected = card.dataset.certificateId === state.selectedCertificateId;
      card.hidden = !visible;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-current", selected ? "true" : "false");
    });
  }

  function setCertificateFilter(filterId) {
    state.certificateFilter = filterId;

    root.querySelectorAll(".certificate-filter").forEach(button => {
      const active = button.dataset.filter === filterId;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const visible = filteredCertificates();
    if (!visible.some(item => item.id === state.selectedCertificateId) && visible[0]) {
      state.selectedCertificateId = visible[0].id;
      updateSelectedCertificate();
    }

    syncCertificateCards();
  }

  function updateSelectedCertificate() {
    const certificate = selectedCertificate();
    if (!certificate) return;

    const list = filteredCertificates();
    const index = list.findIndex(item => item.id === certificate.id);

    elements.certificateFeatureImage?.classList.add("is-changing");

    window.setTimeout(
      () => {
        if (elements.certificateFeatureImage) {
          elements.certificateFeatureImage.src = certificate.image;
          elements.certificateFeatureImage.alt = certificate.title;
          elements.certificateFeatureImage.classList.remove("is-changing");
        }
      },
      reducedMotion ? 0 : 120
    );

    safeText(
      elements.certificateFeatureCategory,
      (certificateCategoryMap[certificate.category] || certificate.category).toUpperCase()
    );
    safeText(elements.certificateFeatureTitle, certificate.title);
    safeText(elements.certificateFeatureIssuer, certificate.issuer);
    safeText(elements.certificateFeatureStatus, certificate.status || "Issued credential");
    safeText(
      elements.certificateFeaturePosition,
      `${pad(index + 1)} / ${pad(list.length)}`
    );

    elements.certificateFeatureVisual?.setAttribute(
      "aria-label",
      `Open full-size certificate: ${certificate.title}`
    );

    syncCertificateCards();
  }

  function selectCertificate(certificateId) {
    if (!credentialData.certificates?.some(item => item.id === certificateId)) return;
    state.selectedCertificateId = certificateId;
    updateSelectedCertificate();
  }

  function openCertificateDialog() {
    const certificate = selectedCertificate();
    if (!certificate || !elements.certificateDialog) return;

    if (elements.certificateDialogImage) {
      elements.certificateDialogImage.src = certificate.image;
      elements.certificateDialogImage.alt = certificate.title;
    }

    document.documentElement.classList.add("is-certificate-dialog-open");

    if (typeof elements.certificateDialog.showModal === "function") {
      if (!elements.certificateDialog.open) elements.certificateDialog.showModal();
    } else {
      elements.certificateDialog.setAttribute("open", "");
    }
  }

  function closeCertificateDialog() {
    if (!elements.certificateDialog) return;
    if (typeof elements.certificateDialog.close === "function") {
      if (elements.certificateDialog.open) elements.certificateDialog.close();
    } else {
      elements.certificateDialog.removeAttribute("open");
    }
    document.documentElement.classList.remove("is-certificate-dialog-open");
  }

  function setupCertificateDialog() {
    const visual = elements.certificateFeatureVisual;

    elements.certificateViewButton?.remove();
    visual?.querySelector(".certificate-feature__scanner")?.remove();

    const dialogInfo = elements.certificateDialog?.querySelector(".certificate-dialog__info");
    dialogInfo?.remove();
    elements.certificateDialog?.removeAttribute("aria-labelledby");
    elements.certificateDialog?.setAttribute("aria-label", "Certificate image preview");

    if (visual) {
      visual.tabIndex = 0;
      visual.setAttribute("role", "button");
      visual.addEventListener("click", openCertificateDialog);
      visual.addEventListener("keydown", event => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        openCertificateDialog();
      });
    }

    elements.certificateDialogClose?.addEventListener("click", closeCertificateDialog);
    elements.certificateDialog?.addEventListener("cancel", event => {
      event.preventDefault();
      closeCertificateDialog();
    });
    elements.certificateDialog?.addEventListener("click", event => {
      if (event.target === elements.certificateDialog) closeCertificateDialog();
    });
    elements.certificateDialog?.addEventListener("close", () => {
      document.documentElement.classList.remove("is-certificate-dialog-open");
      visual?.focus?.({ preventScroll: true });
    });
  }

  /* ========================= BADGES ========================= */

  const badgeCategoryMeta = {
    all: { label: "All", color: "#4fe0bc" },
    cybersecurity: { label: "Cybersecurity", color: "#33d6d0" },
    "artificial-intelligence": { label: "AI", color: "#79f2a3" },
    data: { label: "Data", color: "#ff69a8" },
    web: { label: "Web", color: "#a98bff" },
    quantum: { label: "Quantum", color: "#65c8ff" }
  };

const badgeGalleryRuntime = {
  viewport: null,
  startX: 0,
  startScrollLeft: 0,
  pointerId: null,
  dragging: false,
  moved: 0,
  pressedCard: null,
  suppressClickUntil: 0
};

  function badgeCategoryLabel(category) {
    return badgeCategoryMeta[category]?.label || category || "Credential";
  }

  function badgeCategoryColor(category) {
    return badgeCategoryMeta[category]?.color || "#4fe0bc";
  }

  function filteredBadges() {
    const badges = badgeData.badges || [];
    if (state.badgeFilter === "all") return badges;
    return badges.filter(badge => badge.category === state.badgeFilter);
  }

  function ensureBadgeGalleryChrome() {
    const feature = elements.badgeFeature;
    const passport = feature?.closest(".badge-passport");
    if (!feature || !passport) return;

    passport.classList.remove("badge-passport--ribbons");
    passport.classList.add("badge-passport--gallery");

    const header = passport.querySelector(".badge-passport__header");
    safeText(header?.querySelector("h3"), "MY DIGITAL BADGE CERTIFICATES");

    if (feature.dataset.galleryChrome === "true") return;

    feature.dataset.galleryChrome = "true";
    feature.className = "badge-feature badge-feature--gallery";
    feature.replaceChildren();

    const stage = document.createElement("div");
    stage.className = "badge-stage";
    stage.innerHTML = `
      <span id="badge-stage-ghost" class="badge-stage__ghost" aria-hidden="true">CREDENTIAL</span>

      <div class="badge-stage__copy">
        <span id="badge-focus-kicker">SELECTED CREDENTIAL</span>
        <h4 id="badge-feature-title">Digital credential</h4>
        <p id="badge-feature-description">Issuer and credential status</p>

        <div class="badge-stage__meta" aria-label="Selected badge details">
          <span>
            <small>DOMAIN</small>
            <strong id="badge-feature-domain">Credential</strong>
          </span>
          <span>
            <small>ISSUER</small>
            <strong id="badge-feature-issuer">Issuer</strong>
          </span>
        </div>
      </div>

      <div class="badge-stage__visual" aria-live="polite">
        <span class="badge-stage__orbit badge-stage__orbit--one" aria-hidden="true"></span>
        <span class="badge-stage__orbit badge-stage__orbit--two" aria-hidden="true"></span>
        <div class="badge-stage__image-frame">
          <img class="badge-feature__image" alt="" />
          <span class="badge-stage__corners" aria-hidden="true"></span>
        </div>
        <span class="badge-stage__pedestal" aria-hidden="true"></span>
      </div>
    `;

    const filters = document.createElement("div");
    filters.id = "badge-domain-list";
    filters.className = "badge-domain-list badge-domain-list--gallery";
    filters.setAttribute("aria-label", "Badge domain filters");

    feature.append(stage, filters);

    elements.badgeFeatureTitle = feature.querySelector("#badge-feature-title");
    elements.badgeFeatureDescription = feature.querySelector("#badge-feature-description");
    elements.badgeDomainList = filters;
  }

  function renderBadgeDomains() {
    if (!elements.badgeDomainList) return;

    const allBadges = badgeData.badges || [];
    const categories = [
      { id: "all", label: "All", count: allBadges.length },
      ...Array.from(new Set(allBadges.map(badge => badge.category))).map(id => ({
        id,
        label: badgeCategoryLabel(id),
        count: allBadges.filter(badge => badge.category === id).length
      }))
    ];

    elements.badgeDomainList.replaceChildren(
      ...categories.map(category => {
        const button = document.createElement("button");
        button.className = "badge-domain-filter badge-domain-filter--gallery";
        button.type = "button";
        button.dataset.badgeFilter = category.id;
        button.style.setProperty("--domain-accent", badgeCategoryColor(category.id));
        button.classList.toggle("is-active", state.badgeFilter === category.id);
        button.setAttribute("aria-pressed", String(state.badgeFilter === category.id));
        button.innerHTML = `<span>${category.label}</span><small>${pad(category.count)}</small>`;
        button.addEventListener("click", () => {
          state.badgeFilter = category.id;
          const visible = filteredBadges();
          if (visible.length && !visible.some(item => item.id === state.selectedBadgeId)) {
            state.selectedBadgeId = visible[0].id;
          }
          renderBadgeDomains();
          renderBadgeGallery();
        });
        return button;
      })
    );
  }

  function createBadgeGalleryCard(badge, index) {
    const button = document.createElement("button");
    button.className = "badge-gallery-card";
    button.type = "button";
    button.dataset.badgeId = badge.id;
    button.dataset.category = badge.category;
    button.style.setProperty("--badge-accent", badgeCategoryColor(badge.category));
    button.style.setProperty("--badge-stagger", `${((index % 3) - 1) * 7}px`);
    button.setAttribute("aria-label", `${badge.title}, issued by ${badge.issuer}`);
    button.setAttribute("aria-pressed", String(state.selectedBadgeId === badge.id));

    const visual = document.createElement("span");
    visual.className = "badge-gallery-card__visual";

    const image = document.createElement("img");
    image.src = badge.image;
    image.alt = badge.title;
    image.loading = index < 8 ? "eager" : "lazy";
    image.decoding = "async";

    const code = document.createElement("span");
    code.className = "badge-gallery-card__code";
    code.textContent = pad((badgeData.badges || []).findIndex(item => item.id === badge.id) + 1);

    const domain = document.createElement("span");
    domain.className = "badge-gallery-card__domain";
    domain.textContent = badgeCategoryLabel(badge.category);

    visual.append(image, code, domain);

    const copy = document.createElement("span");
    copy.className = "badge-gallery-card__copy";

    const title = document.createElement("strong");
    title.textContent = badge.title;

    const issuer = document.createElement("small");
    issuer.textContent = badge.issuer;

    copy.append(title, issuer);
    button.append(visual, copy);

    button.addEventListener("click", () => {
      if (performance.now() < badgeGalleryRuntime.suppressClickUntil) return;
      selectBadge(badge.id, button);
    });

    button.addEventListener("keydown", event => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const cards = [...root.querySelectorAll(".badge-gallery-card")];
      const current = cards.indexOf(button);
      const next = event.key === "ArrowRight"
        ? Math.min(cards.length - 1, current + 1)
        : Math.max(0, current - 1);
      cards[next]?.focus();
    });

    return button;
  }

  function updateBadgeGalleryProgress() {
    const viewport = badgeGalleryRuntime.viewport;
    const progress = elements.badgeGrid?.querySelector(".badge-gallery-progress span");
    if (!viewport || !progress) return;

    const maximum = Math.max(1, viewport.scrollWidth - viewport.clientWidth);
    const ratio = Math.max(0, Math.min(1, viewport.scrollLeft / maximum));
    const thumbWidth = Math.max(12, viewport.clientWidth / Math.max(viewport.scrollWidth, 1) * 100);
    const travel = 100 - thumbWidth;

    progress.style.width = `${thumbWidth}%`;
    progress.style.transform = `translateX(${travel ? ratio * travel / thumbWidth * 100 : 0}%)`;
  }

function setupBadgeGalleryDrag(viewport) {
  badgeGalleryRuntime.viewport = viewport;

  viewport.addEventListener("pointerdown", event => {
    if (event.button !== undefined && event.button !== 0) return;

    badgeGalleryRuntime.dragging = true;
    badgeGalleryRuntime.pointerId = event.pointerId;
    badgeGalleryRuntime.startX = event.clientX;
    badgeGalleryRuntime.startScrollLeft = viewport.scrollLeft;
    badgeGalleryRuntime.moved = 0;

    /*
     * Remember which badge was pressed.
     * This allows a normal click and dragging to work together.
     */
    badgeGalleryRuntime.pressedCard =
      event.target.closest(".badge-gallery-card");

    viewport.classList.add("is-dragging");

    viewport.setPointerCapture?.(
      event.pointerId
    );
  });

  viewport.addEventListener("pointermove", event => {
    if (
      !badgeGalleryRuntime.dragging ||
      event.pointerId !== badgeGalleryRuntime.pointerId
    ) {
      return;
    }

    const delta =
      event.clientX - badgeGalleryRuntime.startX;

    badgeGalleryRuntime.moved = Math.max(
      badgeGalleryRuntime.moved,
      Math.abs(delta)
    );

    viewport.scrollLeft =
      badgeGalleryRuntime.startScrollLeft - delta;
  });

  function finishBadgeInteraction(event, cancelled = false) {
    if (!badgeGalleryRuntime.dragging) return;

    const pressedCard =
      badgeGalleryRuntime.pressedCard;

    const wasDragged =
      badgeGalleryRuntime.moved > 7;

    badgeGalleryRuntime.dragging = false;
    badgeGalleryRuntime.pointerId = null;
    badgeGalleryRuntime.pressedCard = null;

    viewport.classList.remove("is-dragging");

    if (
      viewport.hasPointerCapture?.(
        event.pointerId
      )
    ) {
      viewport.releasePointerCapture(
        event.pointerId
      );
    }

    if (wasDragged) {
      badgeGalleryRuntime.suppressClickUntil =
        performance.now() + 180;
    } else if (!cancelled && pressedCard) {
      const badgeId =
        pressedCard.dataset.badgeId;

      const badge =
        (badgeData.badges || []).find(
          item => String(item.id) === String(badgeId)
        );

      if (badge) {
        /*
         * Prevent the browser's delayed click event
         * from selecting the same badge twice.
         */
        badgeGalleryRuntime.suppressClickUntil =
          performance.now() + 180;

        selectBadge(
          badge.id,
          pressedCard
        );
      }
    }

    updateBadgeGalleryProgress();
  }

  viewport.addEventListener(
    "pointerup",
    event => {
      finishBadgeInteraction(event, false);
    }
  );

  viewport.addEventListener(
    "pointercancel",
    event => {
      finishBadgeInteraction(event, true);
    }
  );

  viewport.addEventListener(
    "wheel",
    event => {
      if (
        Math.abs(event.deltaY) <=
        Math.abs(event.deltaX)
      ) {
        return;
      }

      event.preventDefault();
      viewport.scrollLeft += event.deltaY;
    },
    { passive: false }
  );

  viewport.addEventListener(
    "scroll",
    updateBadgeGalleryProgress,
    { passive: true }
  );

  viewport.addEventListener(
    "mousemove",
    event => {
      const rect =
        viewport.getBoundingClientRect();

      viewport.style.setProperty(
        "--gallery-x",
        `${event.clientX - rect.left}px`
      );

      viewport.style.setProperty(
        "--gallery-y",
        `${event.clientY - rect.top}px`
      );
    }
  );
}

function centerBadgeInsideGallery(card, behavior = "smooth") {
  const viewport = badgeGalleryRuntime.viewport;

  if (!viewport || !card) return;

  const viewportRect = viewport.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  /*
   * Calculate movement only inside the badge viewport.
   * This never moves the webpage itself.
   */
  const difference =
    cardRect.left -
    viewportRect.left -
    (viewport.clientWidth - cardRect.width) / 2;

  const targetScroll =
    viewport.scrollLeft + difference;

  const maximumScroll = Math.max(
    0,
    viewport.scrollWidth - viewport.clientWidth
  );

  viewport.scrollTo({
    left: Math.max(
      0,
      Math.min(targetScroll, maximumScroll)
    ),
    behavior: reducedMotion ? "auto" : behavior
  });
}

  function renderBadgeGallery() {
    const visibleBadges = filteredBadges();
    if (!elements.badgeGrid) return;

    if (visibleBadges.length && !visibleBadges.some(item => item.id === state.selectedBadgeId)) {
      state.selectedBadgeId = visibleBadges[0].id;
    }

    const shell = document.createElement("div");
    shell.className = "badge-gallery-shell";

    const heading = document.createElement("div");
    heading.className = "badge-gallery-shell__heading";
    heading.innerHTML = `
    <strong>${pad(visibleBadges.length)} VISIBLE · DRAG OR SELECT</strong>
    `;

    const viewport = document.createElement("div");
    viewport.className = "badge-gallery-viewport";
    viewport.tabIndex = 0;
    viewport.setAttribute("aria-label", "Scrollable digital badge gallery");

    const track = document.createElement("div");
    track.className = "badge-gallery-track";
    track.append(...visibleBadges.map(createBadgeGalleryCard));

    viewport.append(track);

    const progress = document.createElement("div");
    progress.className = "badge-gallery-progress";
    progress.setAttribute("aria-hidden", "true");
    progress.innerHTML = "<span></span>";

    shell.append(viewport, progress);
    elements.badgeGrid.replaceChildren(shell);

    setupBadgeGalleryDrag(viewport);
    updateSelectedBadge(false);

requestAnimationFrame(() => {
  updateBadgeGalleryProgress();

  const selected = viewport.querySelector(
    ".badge-gallery-card.is-selected"
  );

  centerBadgeInsideGallery(selected, "auto");
});
  }

  function renderBadges() {
    const allBadges = badgeData.badges || [];
    safeText(elements.badgeCount, pad(allBadges.length));

    ensureBadgeGalleryChrome();
    renderBadgeDomains();

    if (!allBadges.length || !elements.badgeGrid) return;

    if (!allBadges.some(badge => badge.id === state.selectedBadgeId)) {
      state.selectedBadgeId = allBadges[0].id;
    }

    safeText(
      elements.badgePassportStatus,
      `${pad(allBadges.length)} BADGES · ${pad(new Set(allBadges.map(item => item.category)).size)} DOMAINS`
    );

    renderBadgeGallery();
  }

  function selectBadge(badgeId, sourceCard = null) {
  state.selectedBadgeId = badgeId;
  updateSelectedBadge(true);
  centerBadgeInsideGallery(sourceCard, "smooth");
}

  function updateSelectedBadge(animate = true) {
    const badge = selectedBadge();
    if (!badge) return;

    ensureBadgeGalleryChrome();

    const allBadges = badgeData.badges || [];
    const accent = badgeCategoryColor(badge.category);
    const feature = elements.badgeFeature;
    const passport = feature?.closest(".badge-passport");
    const image = feature?.querySelector(".badge-feature__image");
    const kicker = feature?.querySelector("#badge-focus-kicker");
    const domain = feature?.querySelector("#badge-feature-domain");
    const issuer = feature?.querySelector("#badge-feature-issuer");
    const ghost = feature?.querySelector("#badge-stage-ghost");

    feature?.style.setProperty("--badge-accent", accent);
    passport?.style.setProperty("--badge-accent", accent);

    if (animate && feature) {
      feature.classList.remove("is-changing");
      void feature.offsetWidth;
      feature.classList.add("is-changing");
    }

    if (image) {
      image.src = badge.image;
      image.alt = badge.title;
    }

    safeText(kicker, `${badgeCategoryLabel(badge.category)} · SELECTED BADGE`);
    safeText(elements.badgeFeatureTitle, badge.title);
    safeText(
      elements.badgeFeatureDescription,
      `${badge.issuer}${badge.issued ? ` · ${badge.issued}` : ""}${
        badge.status ? ` · ${badge.status}` : ""
      }`
    );
    safeText(domain, badgeCategoryLabel(badge.category));
    safeText(issuer, badge.issuer);
    safeText(ghost, badgeCategoryLabel(badge.category).toUpperCase());

    root.querySelectorAll(".badge-gallery-card").forEach(card => {
      const selected = card.dataset.badgeId === badge.id;
      card.classList.toggle("is-selected", selected);
      card.setAttribute("aria-pressed", String(selected));
    });
  }

  function setupAdaptiveProjectNavLabel() {
  const credentialsSection = root.querySelector(".credentials-section");

  const labels = [
    ...document.querySelectorAll(".nav-project-dynamic-label")
  ];

  if (!credentialsSection || !labels.length) return;

  const glitchCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
  let currentLabel = "";
  let scrollFrame = 0;
  let textAnimationFrame = 0;
  let cleanupTimer = 0;

  function applyFinalLabel(nextLabel) {
    labels.forEach(label => {
      label.textContent = nextLabel;
      label.dataset.label = nextLabel;
      label.classList.remove("is-glitching");

      const link = label.closest("a");
      link?.setAttribute("aria-label", nextLabel);
    });
  }

  function changeNavLabel(nextLabel, animate = true) {
    if (nextLabel === currentLabel) return;

    currentLabel = nextLabel;

    window.cancelAnimationFrame(textAnimationFrame);
    window.clearTimeout(cleanupTimer);

    labels.forEach(label => {
      label.dataset.label = nextLabel;

      const link = label.closest("a");
      link?.setAttribute("aria-label", nextLabel);
    });

    if (!animate || reducedMotion) {
      applyFinalLabel(nextLabel);
      return;
    }

    labels.forEach(label => {
      label.classList.remove("is-glitching");

      /*
       * Restart the CSS animation even when the user
       * scrolls between the two areas repeatedly.
       */
      void label.offsetWidth;
      label.classList.add("is-glitching");
    });

    const duration = 430;
    const startedAt = performance.now();

    function animateLetters(now) {
      const progress = Math.min(
        1,
        (now - startedAt) / duration
      );

      const revealedCharacters = Math.floor(
        progress * nextLabel.length
      );

      const scrambledLabel = [...nextLabel]
        .map((character, index) => {
          if (character === " ") return " ";

          if (index < revealedCharacters) {
            return character;
          }

          return glitchCharacters[
            Math.floor(Math.random() * glitchCharacters.length)
          ];
        })
        .join("");

      labels.forEach(label => {
        label.textContent = scrambledLabel;
      });

      if (progress < 1) {
        textAnimationFrame =
          window.requestAnimationFrame(animateLetters);
        return;
      }

      labels.forEach(label => {
        label.textContent = nextLabel;
      });

      cleanupTimer = window.setTimeout(() => {
        labels.forEach(label => {
          label.classList.remove("is-glitching");
        });
      }, 120);
    }

    textAnimationFrame =
      window.requestAnimationFrame(animateLetters);
  }

  function updateAdaptiveLabel(animate = true) {
    const credentialsRect =
      credentialsSection.getBoundingClientRect();

    const navbar =
      labels[0].closest("nav") ||
      labels[0].closest("header");

    const navbarBottom =
      navbar?.getBoundingClientRect().bottom || 0;

    /*
     * The word changes shortly before the Certificates
     * section reaches the main viewing area.
     */
    const triggerLine = Math.max(
      navbarBottom + 28,
      window.innerHeight * 0.3
    );

    const credentialsAreActive =
      credentialsRect.top <= triggerLine &&
      credentialsRect.bottom > triggerLine;

    changeNavLabel(
      credentialsAreActive
        ? "Credentials"
        : "Projects",
      animate
    );
  }

  function scheduleAdaptiveLabelUpdate() {
    if (scrollFrame) return;

    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateAdaptiveLabel(true);
    });
  }

  updateAdaptiveLabel(false);

  window.addEventListener(
    "scroll",
    scheduleAdaptiveLabelUpdate,
    { passive: true }
  );

  window.addEventListener(
    "resize",
    scheduleAdaptiveLabelUpdate,
    { passive: true }
  );
}

  function setupProjectsTopFocus() {
    let focusBlur = document.querySelector(".projects-top-focus-blur");

    if (!focusBlur) {
      focusBlur = document.createElement("div");
      focusBlur.className = "projects-top-focus-blur";
      focusBlur.setAttribute("aria-hidden", "true");
      document.body.append(focusBlur);
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const activationLine = window.innerHeight * .34;
      const active = rect.top <= activationLine && rect.bottom >= window.innerHeight * .18;
      focusBlur.classList.toggle("is-visible", active);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    update();
  }

  /* ========================= REVEALS + COUNTS ========================= */

  function setupMetrics() {
    safeText(elements.introduction, projectData.introduction);
    safeText(elements.totalCount, pad(projectData.projects.length));
    safeText(
      elements.domainCount,
      pad((projectData.categories || []).filter(category => category.id !== "all").length)
    );
    safeText(elements.toolCount, `${uniqueToolCount()}+`);
    safeText(elements.showroomCount, `${pad(projectData.projects.length)} PROJECTS ONLINE`);

    const certificates = credentialData.certificates || [];
    const badges = badgeData.badges || [];
    const credentialDomainCount = badgeData.domains?.length
      ? badgeData.domains.length
      : new Set([
          ...certificates.map(item => item.category),
          ...badges.map(item => item.category)
        ]).size;

    safeText(elements.certificateCount, pad(certificates.length));
    safeText(elements.badgeCount, pad(badges.length));
    safeText(elements.credentialDomainCount, pad(credentialDomainCount));
  }

  function setupReveals() {
    const items = root.querySelectorAll(".projects-reveal");

    if (reducedMotion || !("IntersectionObserver" in window)) {
      items.forEach(item => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: .1, rootMargin: "0px 0px -8% 0px" }
    );

    items.forEach(item => observer.observe(item));
  }

  function initialise() {
    setupMetrics();
    setupProjectDialog();
    setupVisualDrag();
    renderProjectFilters();
    setupProjectIndexExperience();
    renderProjectCards();
    updateSelectedProject();
    setupStageMotion();

    renderCertificateFilters();
    renderCertificateCards();
    updateSelectedCertificate();
    setupCertificateDialog();

    renderBadges();
    setupAdaptiveProjectNavLabel();
    setupProjectsTopFocus();
    setupReveals();
  }

  initialise();
})();
