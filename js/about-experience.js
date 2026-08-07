(() => {
  "use strict";

  const data = window.ABOUT_DATA || {};
  const section = document.querySelector("#about");
  if (!section) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const label = document.querySelector("#about-label");
  const title = document.querySelector("#about-title");
  const introduction = document.querySelector("#about-introduction");
  const philosophyLead = document.querySelector("#about-philosophy-lead");
  const philosophy = document.querySelector("#about-philosophy");
  const quickFacts = document.querySelector("#about-quick-facts");
  const timeline = document.querySelector("#about-timeline");
  const timelineProgress = document.querySelector("#about-timeline-progress");
  const principles = document.querySelector("#about-principles");
  const profileCard = document.querySelector("#about-profile-card");
  const portraitCanvas = document.querySelector("#about-portrait-canvas");

  const stageConsole = document.querySelector("#about-stage-console");
  const stageNumber = document.querySelector("#about-stage-number");
  const stageEyebrow = document.querySelector("#about-stage-eyebrow");
  const stageTitle = document.querySelector("#about-stage-title");
  const stageSummary = document.querySelector("#about-stage-summary");
  const stageSignal = document.querySelector("#about-stage-signal");
  const stageCapabilities = document.querySelector("#about-stage-capabilities");

  let activeJourneyIndex = 0;

  // ---------------------------------------------------------
  // Content rendering
  // ---------------------------------------------------------
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  if (label && data.sectionLabel) label.textContent = data.sectionLabel;

  if (title && Array.isArray(data.titleLines) && data.titleLines.length) {
    title.innerHTML = data.titleLines
      .map((line, index) => `<span class="${index ? "about-title__accent" : ""}">${escapeHtml(line)}</span>`)
      .join("");
  }

  if (introduction) introduction.textContent = data.introduction || "";
  if (philosophyLead) philosophyLead.textContent = data.philosophyLead || "";
  if (philosophy) philosophy.textContent = data.philosophy || "";

  const profile = data.profile || {};
  setText("#about-profile-code", profile.code);
  setText("#about-profile-status", profile.status);
  setText("#about-profile-location", profile.location);
  setText("#about-profile-focus", profile.focus);

  function setText(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.textContent = value;
  }

  if (quickFacts) {
    quickFacts.innerHTML = (data.quickFacts || []).map(fact => `
      <div class="about-quick-fact">
        <small>${escapeHtml(fact.label)}</small>
        <strong>${escapeHtml(fact.value)}</strong>
      </div>
    `).join("");
  }

  const journey = Array.isArray(data.journey) ? data.journey : [];
  if (timeline) {
    const nodes = journey.map((item, index) => `
      <article class="journey-node" data-journey-index="${index}" tabindex="0">
        <div class="journey-node__top">
          <span class="journey-node__stage">${escapeHtml(item.stage)}</span>
          <span>${escapeHtml(item.period)}</span>
        </div>
        <h4>${escapeHtml(item.title)}</h4>
        <p>${escapeHtml(item.summary)}</p>
      </article>
    `).join("");

    timeline.insertAdjacentHTML("beforeend", nodes);
  }

  const iconPaths = {
    scope: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    network: '<circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><path d="M7 7.5l4 8M17 7.5l-4 8M7 6h10"/>',
    layers: '<path d="M12 3l8 4-8 4-8-4 8-4zM4 12l8 4 8-4M4 17l8 4 8-4"/>',
    iterate: '<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6.2 8a7 7 0 0111.6-2L20 8M4 16l2.2 2A7 7 0 0018 16"/>'
  };

  if (principles) {
    principles.innerHTML = (data.principles || []).map(item => `
      <article class="principle-card interactive">
        <div class="principle-card__top">
          <span>PRINCIPLE</span>
          <b>${escapeHtml(item.number)}</b>
        </div>
        <div class="principle-card__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24">${iconPaths[item.icon] || iconPaths.network}</svg>
        </div>
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>
    `).join("");
  }
  function setupAboutTopFocus() {
  let focusBlur = document.querySelector(".about-top-focus-blur");

  if (!focusBlur) {
    focusBlur = document.createElement("div");
    focusBlur.className = "about-top-focus-blur";
    focusBlur.setAttribute("aria-hidden", "true");
    document.body.append(focusBlur);
  }

  let frame = 0;

  const update = () => {
    frame = 0;

    const rect = section.getBoundingClientRect();

    const active =
      rect.top <= window.innerHeight * 0.34 &&
      rect.bottom >= window.innerHeight * 0.18;

    focusBlur.classList.toggle("is-visible", active);
  };

  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };

  window.addEventListener("scroll", schedule, {
    passive: true
  });

  window.addEventListener("resize", schedule, {
    passive: true
  });

  update();
}

setupAboutTopFocus();
  // ---------------------------------------------------------
  // Section reveals
  // ---------------------------------------------------------
  const revealElements = [...section.querySelectorAll(".about-reveal, .journey-node, .principle-card")];
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement
        ? [...entry.target.parentElement.children].filter(child =>
            child.classList.contains("principle-card") || child.classList.contains("journey-node"))
        : [];
      const index = Math.max(0, siblings.indexOf(entry.target));
      entry.target.style.transitionDelay = `${Math.min(index * 85, 340)}ms`;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: .13, rootMargin: "0px 0px -8% 0px" });

  revealElements.forEach(element => revealObserver.observe(element));

  // ---------------------------------------------------------
  // Journey state machine
  // ---------------------------------------------------------
  const journeyNodes = [...section.querySelectorAll(".journey-node")];
  const stageColors = ["#22d3ee", "#648dff", "#8b5cf6", "#42ee9b"];

  function updateStage(index) {
    if (!journey.length) return;
    activeJourneyIndex = Math.max(0, Math.min(index, journey.length - 1));
    const item = journey[activeJourneyIndex];

    journeyNodes.forEach((node, nodeIndex) => {
      node.classList.toggle("is-active", nodeIndex === activeJourneyIndex);
      node.classList.toggle("is-passed", nodeIndex < activeJourneyIndex);
    });

    if (stageNumber) stageNumber.textContent = `${String(activeJourneyIndex + 1).padStart(2, "0")} / ${String(journey.length).padStart(2, "0")}`;
    if (stageEyebrow) stageEyebrow.textContent = item.eyebrow || "";
    if (stageTitle) stageTitle.textContent = item.title || "";
    if (stageSummary) stageSummary.textContent = item.summary || "";
    if (stageSignal) stageSignal.textContent = item.signal || "";
    if (stageConsole) stageConsole.style.setProperty("--active-stage-color", stageColors[activeJourneyIndex % stageColors.length]);

    if (stageCapabilities) {
      stageCapabilities.innerHTML = (item.capabilities || [])
        .map(capability => `<span>${escapeHtml(capability)}</span>`)
        .join("");
    }
  }

  const journeyObserver = new IntersectionObserver(entries => {
    const candidates = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (!candidates.length) return;
    updateStage(Number(candidates[0].target.dataset.journeyIndex));
  }, { rootMargin: "-31% 0px -45% 0px", threshold: [0, .2, .45, .7] });

  journeyNodes.forEach(node => {
    journeyObserver.observe(node);
    node.addEventListener("mouseenter", () => updateStage(Number(node.dataset.journeyIndex)));
    node.addEventListener("focus", () => updateStage(Number(node.dataset.journeyIndex)));
    node.addEventListener("click", () => updateStage(Number(node.dataset.journeyIndex)));
  });

  function updateTimelineProgress() {
    if (!timeline || !timelineProgress) return;
    const rect = timeline.getBoundingClientRect();
    const viewportAnchor = window.innerHeight * .52;
    const progress = Math.max(0, Math.min(1, (viewportAnchor - rect.top) / Math.max(rect.height, 1)));
    timelineProgress.style.transform = `scaleY(${progress})`;
  }

  window.addEventListener("scroll", updateTimelineProgress, { passive: true });
  updateTimelineProgress();
  updateStage(0);

  // ---------------------------------------------------------
  // Principle spotlight and tilt
  // ---------------------------------------------------------
  section.querySelectorAll(".principle-card").forEach(card => {
    card.addEventListener("pointermove", event => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      card.style.setProperty("--card-x", `${x}px`);
      card.style.setProperty("--card-y", `${y}px`);

      if (coarsePointer || reducedMotion) return;
      const rotateY = ((x / rect.width) - .5) * 5;
      const rotateX = ((y / rect.height) - .5) * -5;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
      card.style.transform = "";
    });
  });

  if (profileCard) {
    profileCard.addEventListener("pointermove", event => {
      if (coarsePointer || reducedMotion) return;
      const rect = profileCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      profileCard.style.transform = `perspective(1100px) rotateX(${y * -3.8}deg) rotateY(${x * 4.5}deg)`;
    });

    profileCard.addEventListener("pointerleave", () => {
      profileCard.style.transform = "";
    });
  }

  // ---------------------------------------------------------
  // Canvas identity-map network
  // ---------------------------------------------------------
  if (!portraitCanvas) return;
  const ctx = portraitCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let animationFrame;
  const nodes = [];
  const pointer = { x: -9999, y: -9999, active: false };

  function insidePortrait(nx, ny) {
    const head = ((nx) ** 2) / (.205 ** 2) + ((ny + .20) ** 2) / (.235 ** 2) <= 1;
    const neck = Math.abs(nx) < .105 && ny > -.01 && ny < .23;
    const shoulders = ((nx) ** 2) / (.44 ** 2) + ((ny - .31) ** 2) / (.25 ** 2) <= 1 && ny > .10;
    return head || neck || shoulders;
  }

  function buildPortraitNodes() {
    nodes.length = 0;
    const targetCount = coarsePointer ? 84 : 128;
    let attempts = 0;

    while (nodes.length < targetCount && attempts < 9000) {
      attempts += 1;
      const nx = Math.random() * .96 - .48;
      const ny = Math.random() * .92 - .46;
      if (!insidePortrait(nx, ny)) continue;

      nodes.push({
        nx,
        ny,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        pulse: Math.random() * Math.PI * 2,
        depth: Math.random() * .7 + .3
      });
    }
  }

  function resizePortrait() {
    const rect = portraitCanvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    portraitCanvas.width = Math.floor(width * dpr);
    portraitCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    nodes.forEach(node => {
      node.x = width / 2 + node.nx * width * .82;
      node.y = height / 2 + node.ny * height * .88;
    });
  }

  function currentColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      cyan: styles.getPropertyValue("--accent-cyan").trim() || "#22d3ee",
      purple: styles.getPropertyValue("--accent-purple").trim() || "#8b5cf6",
      text: styles.getPropertyValue("--text-primary").trim() || "#ffffff"
    };
  }

  function drawPortrait(time) {
    const colors = currentColors();
    ctx.clearRect(0, 0, width, height);

    const drift = Math.sin(time * .00035 + activeJourneyIndex) * 4;
    const targetXScale = 1 + activeJourneyIndex * .012;

    for (const node of nodes) {
      const baseX = width / 2 + node.nx * width * .82 * targetXScale;
      const baseY = height / 2 + node.ny * height * .88 + Math.sin(time * .0012 + node.pulse) * 1.5 + drift * node.depth;

      node.vx += (baseX - node.x) * .018;
      node.vy += (baseY - node.y) * .018;

      if (pointer.active) {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 90 && distance > 0) {
          const force = (90 - distance) / 90;
          node.vx += (dx / distance) * force * .65;
          node.vy += (dy / distance) * force * .65;
        }
      }

      node.vx *= .88;
      node.vy *= .88;
      node.x += node.vx;
      node.y += node.vy;
    }

    const linkDistance = Math.min(width, height) * .105;
    const linkDistanceSq = linkDistance * linkDistance;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq >= linkDistanceSq) continue;

        const alpha = (1 - distanceSq / linkDistanceSq) * .15;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = hexToRgba(activeJourneyIndex % 2 ? colors.purple : colors.cyan, alpha);
        ctx.lineWidth = .55;
        ctx.stroke();
      }
    }

    nodes.forEach(node => {
      const pulse = .68 + Math.sin(time * .002 + node.pulse) * .25;
      ctx.beginPath();
      ctx.arc(node.x, node.y, .7 + node.depth * 1.25, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(node.depth > .62 ? colors.cyan : colors.purple, (.34 + node.depth * .46) * pulse);
      ctx.shadowBlur = node.depth > .68 ? 8 : 0;
      ctx.shadowColor = colors.cyan;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    if (!reducedMotion) animationFrame = requestAnimationFrame(drawPortrait);
  }

  function hexToRgba(color, alpha) {
    if (!color.startsWith("#")) return `rgba(34,211,238,${alpha})`;
    const raw = color.slice(1);
    const normalized = raw.length === 3 ? raw.split("").map(char => char + char).join("") : raw;
    const value = Number.parseInt(normalized, 16);
    const r = (value >> 16) & 255;
    const g = (value >> 8) & 255;
    const b = value & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  portraitCanvas.addEventListener("pointermove", event => {
    const rect = portraitCanvas.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = true;
  });

  portraitCanvas.addEventListener("pointerleave", () => {
    pointer.active = false;
  });

  buildPortraitNodes();
  resizePortrait();

  if (reducedMotion) {
    drawPortrait(0);
  } else {
    animationFrame = requestAnimationFrame(drawPortrait);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizePortrait, 120);
  });
})();
