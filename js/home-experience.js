(() => {
  "use strict";

  const data = window.HOME_DATA || {};
  const hero = document.querySelector("#home");
  const heroCanvas = document.querySelector("#hero-canvas");
  const coreCanvas = document.querySelector("#core-canvas");
  const coreStage = document.querySelector("#core-stage");
  const roleText = document.querySelector("#role-text");
  const factsContainer = document.querySelector("#hero-facts");
  const orbitLabelsContainer = document.querySelector("#orbit-labels");
  const pointerCoordinate = document.querySelector("#pointer-coordinate");
  const description = document.querySelector("#hero-description");
  const degree = document.querySelector("#hero-degree");
  const telemetryTemp = document.querySelector("#telemetry-temp");
  const telemetrySync = document.querySelector("#telemetry-sync");
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");

  if (!hero) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  if (degree && data.degree) {
    degree.textContent = data.degree;
    const yearCode = document.querySelector(".eyebrow-code");
    if (yearCode && data.graduationYear) yearCode.textContent = `/ ${data.graduationYear}`;
  }

  if (description && data.description) {
    description.textContent = data.description;
  }

  if (factsContainer) {
    factsContainer.innerHTML = (data.facts || []).map(fact => `
      <div class="hero-fact">
        <strong>${escapeHtml(fact.value)}</strong>
        <span>${escapeHtml(fact.label)}</span>
      </div>
    `).join("");
  }

  if (orbitLabelsContainer) {
    const labels = data.orbitLabels || [];
    orbitLabelsContainer.innerHTML = labels.map((label, index) => {
      const angle = (360 / labels.length) * index - 90;
      return `<span class="orbit-label" style="--orbit-angle:${angle}deg">${escapeHtml(label)}</span>`;
    }).join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function activateHome() {
    document.body.classList.add("intro-complete");
    startRoleRotation();
  }

  window.addEventListener("portfolio:intro-complete", activateHome, { once: true });

  setTimeout(() => {
    if (!document.body.classList.contains("is-loading")) activateHome();
  }, 300);

  let roleTimer;
  let roleIndex = 0;
  const roles = data.roles?.length ? data.roles : ["SYSTEM THINKER"];
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/<>_";

  function scrambleTo(target) {
    if (!roleText) return;

    let frame = 0;
    const totalFrames = Math.max(18, target.length * 2);

    function update() {
      const resolved = Math.floor((frame / totalFrames) * target.length);
      roleText.textContent = target
        .split("")
        .map((character, index) => {
          if (character === " ") return " ";
          if (index < resolved) return character;
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      frame += 1;

      if (frame <= totalFrames) {
        requestAnimationFrame(update);
      } else {
        roleText.textContent = target;
      }
    }

    update();
  }

  function startRoleRotation() {
    if (roleTimer || reducedMotion) {
      if (roleText) roleText.textContent = roles[0];
      return;
    }

    scrambleTo(roles[0]);
    roleTimer = setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      scrambleTo(roles[roleIndex]);
    }, 2850);
  }

  const heroCtx = heroCanvas?.getContext("2d");
  const heroNodes = [];
  let heroWidth = 0;
  let heroHeight = 0;
  let heroAnimationFrame;
  const heroPointer = { x: 0, y: 0, active: false };

  function resizeHeroCanvas() {
    if (!heroCanvas || !heroCtx) return;

    const rect = hero.getBoundingClientRect();
    heroWidth = rect.width;
    heroHeight = rect.height;

    heroCanvas.width = Math.floor(heroWidth * dpr);
    heroCanvas.height = Math.floor(heroHeight * dpr);
    heroCanvas.style.width = `${heroWidth}px`;
    heroCanvas.style.height = `${heroHeight}px`;
    heroCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const targetCount = coarsePointer ? 42 : 78;
    heroNodes.length = 0;

    for (let i = 0; i < targetCount; i++) {
      heroNodes.push({
        x: Math.random() * heroWidth,
        y: Math.random() * heroHeight,
        vx: (Math.random() - .5) * .22,
        vy: (Math.random() - .5) * .22,
        radius: Math.random() * 1.4 + .45,
        depth: Math.random() * .75 + .25,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawHeroNetwork(time) {
    if (!heroCtx) return;

    heroCtx.clearRect(0, 0, heroWidth, heroHeight);

    for (const node of heroNodes) {
      node.x += node.vx * node.depth;
      node.y += node.vy * node.depth;

      if (node.x < -20) node.x = heroWidth + 20;
      if (node.x > heroWidth + 20) node.x = -20;
      if (node.y < -20) node.y = heroHeight + 20;
      if (node.y > heroHeight + 20) node.y = -20;

      if (heroPointer.active) {
        const dx = node.x - heroPointer.x;
        const dy = node.y - heroPointer.y;
        const distance = Math.hypot(dx, dy);

        if (distance < 150 && distance > 0) {
          const force = (150 - distance) / 150;
          node.x += (dx / distance) * force * 1.05;
          node.y += (dy / distance) * force * 1.05;
        }
      }

      const isLight = root.dataset.theme === "light";
      const alpha = .22 + Math.sin(time * .0015 + node.pulse) * .12;
      heroCtx.beginPath();
      heroCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      heroCtx.fillStyle = isLight
        ? `rgba(0, 104, 126, ${alpha * 1.18})`
        : `rgba(75, 224, 245, ${alpha})`;
      heroCtx.fill();
    }

    const maxDistance = 116;
    const maxDistanceSq = maxDistance * maxDistance;

    for (let i = 0; i < heroNodes.length; i++) {
      for (let j = i + 1; j < heroNodes.length; j++) {
        const a = heroNodes[i];
        const b = heroNodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < maxDistanceSq) {
          const opacity = (1 - distanceSq / maxDistanceSq) * .065;
          heroCtx.beginPath();
          heroCtx.moveTo(a.x, a.y);
          heroCtx.lineTo(b.x, b.y);
          heroCtx.strokeStyle = root.dataset.theme === "light"
            ? `rgba(39, 95, 214, ${opacity * 1.4})`
            : `rgba(76, 218, 242, ${opacity})`;
          heroCtx.lineWidth = .55;
          heroCtx.stroke();
        }
      }
    }

    if (!reducedMotion) {
      heroAnimationFrame = requestAnimationFrame(drawHeroNetwork);
    }
  }

  const coreCtx = coreCanvas?.getContext("2d");
  const spherePoints = [];
  let coreSize = 0;
  let coreRotationX = .2;
  let coreRotationY = 0;
  let targetRotationX = .2;
  let targetRotationY = 0;
  let coreAnimationFrame;

  function buildSpherePoints() {
    spherePoints.length = 0;
    const count = coarsePointer ? 78 : 128;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      spherePoints.push({
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function resizeCoreCanvas() {
    if (!coreCanvas || !coreCtx) return;

    const rect = coreCanvas.getBoundingClientRect();
    coreSize = Math.max(1, Math.min(rect.width, rect.height));

    coreCanvas.width = Math.floor(coreSize * dpr);
    coreCanvas.height = Math.floor(coreSize * dpr);
    coreCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rotatePoint(point, rx, ry) {
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x1 = point.x * cosY - point.z * sinY;
    const z1 = point.x * sinY + point.z * cosY;

    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = point.y * cosX - z1 * sinX;
    const z2 = point.y * sinX + z1 * cosX;

    return { x: x1, y: y2, z: z2 };
  }

  function drawCore(time) {
    if (!coreCtx || coreSize <= 0) return;

    coreCtx.clearRect(0, 0, coreSize, coreSize);

    coreRotationY += reducedMotion ? 0 : .0024;
    coreRotationX += (targetRotationX - coreRotationX) * .035;
    coreRotationY += (targetRotationY - coreRotationY) * .015;

    const center = coreSize / 2;
    const radius = coreSize * .355;
    const projected = spherePoints.map(point => {
      const rotated = rotatePoint(point, coreRotationX, coreRotationY);
      const perspective = 1.15 / (1.65 - rotated.z * .45);

      return {
        x: center + rotated.x * radius * perspective,
        y: center + rotated.y * radius * perspective,
        z: rotated.z,
        pulse: point.pulse
      };
    });

    // Ambient core glow
    const glow = coreCtx.createRadialGradient(center, center, 0, center, center, radius * 1.32);
    if (root.dataset.theme === "light") {
      glow.addColorStop(0, "rgba(0, 127, 152, .24)");
      glow.addColorStop(.36, "rgba(91, 53, 203, .13)");
      glow.addColorStop(1, "rgba(109, 61, 232, 0)");
    } else {
      glow.addColorStop(0, "rgba(83, 235, 255, .19)");
      glow.addColorStop(.36, "rgba(94, 82, 255, .11)");
      glow.addColorStop(1, "rgba(139, 92, 246, 0)");
    }
    coreCtx.beginPath();
    coreCtx.arc(center, center, radius * 1.32, 0, Math.PI * 2);
    coreCtx.fillStyle = glow;
    coreCtx.fill();

    // Network connections
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i];
        const b = projected[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);

        if (distance < coreSize * .09 && a.z + b.z > -.6) {
          const opacity = (1 - distance / (coreSize * .09)) * (.05 + (a.z + b.z + 2) * .035);
          coreCtx.beginPath();
          coreCtx.moveTo(a.x, a.y);
          coreCtx.lineTo(b.x, b.y);
          coreCtx.strokeStyle = root.dataset.theme === "light"
            ? `rgba(0, 102, 128, ${opacity * 1.7})`
            : `rgba(93, 230, 247, ${opacity})`;
          coreCtx.lineWidth = .55;
          coreCtx.stroke();
        }
      }
    }

    projected
      .sort((a, b) => a.z - b.z)
      .forEach(point => {
        const depth = (point.z + 1) / 2;
        const pointRadius = .7 + depth * 1.55;
        const pulse = .72 + Math.sin(time * .002 + point.pulse) * .25;

        coreCtx.beginPath();
        coreCtx.arc(point.x, point.y, pointRadius, 0, Math.PI * 2);
        const isLight = root.dataset.theme === "light";
        coreCtx.fillStyle = depth > .55
          ? (isLight
              ? `rgba(0, 104, 126, ${(.26 + depth * .64) * pulse})`
              : `rgba(109, 239, 255, ${(.2 + depth * .62) * pulse})`)
          : (isLight
              ? `rgba(91, 53, 203, ${(.18 + depth * .42) * pulse})`
              : `rgba(145, 106, 255, ${(.12 + depth * .35) * pulse})`);
        coreCtx.shadowBlur = depth > .68 ? 9 : 0;
        coreCtx.shadowColor = "rgba(34,211,238,.8)";
        coreCtx.fill();
        coreCtx.shadowBlur = 0;
      });

    // Rotating latitude ring
    coreCtx.save();
    coreCtx.translate(center, center);
    coreCtx.rotate(time * .00035);
    coreCtx.beginPath();
    coreCtx.ellipse(0, 0, radius * .92, radius * .29, .25, 0, Math.PI * 2);
    coreCtx.strokeStyle = root.dataset.theme === "light"
      ? "rgba(0, 102, 128, .24)"
      : "rgba(156, 239, 255, .15)";
    coreCtx.lineWidth = .7;
    coreCtx.stroke();
    coreCtx.restore();

    coreAnimationFrame = requestAnimationFrame(drawCore);
  }

  // ---------------------------------------------------------
  // Pointer, parallax, tilt and custom cursor
  // ---------------------------------------------------------
  let cursorX = window.innerWidth / 2;
  let cursorY = window.innerHeight / 2;
  let ringX = cursorX;
  let ringY = cursorY;
  let cursorAnimationFrame;

  function animateCursor() {
    ringX += (cursorX - ringX) * .16;
    ringY += (cursorY - ringY) * .16;

    if (cursorDot) {
      cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    }
    if (cursorRing) {
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }

    cursorAnimationFrame = requestAnimationFrame(animateCursor);
  }

  function handlePointerMove(event) {
    const rect = hero.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const normalizedX = localX / rect.width;
    const normalizedY = localY / rect.height;

    heroPointer.x = localX;
    heroPointer.y = localY;
    heroPointer.active = true;

    hero.style.setProperty("--pointer-x", `${normalizedX * 100}%`);
    hero.style.setProperty("--pointer-y", `${normalizedY * 100}%`);

    if (pointerCoordinate) {
      pointerCoordinate.textContent =
        `X${String(Math.round(normalizedX * 999)).padStart(3, "0")} / ` +
        `Y${String(Math.round(normalizedY * 999)).padStart(3, "0")}`;
    }

    if (coreStage && !coarsePointer && !reducedMotion) {
      const stageRect = coreStage.getBoundingClientRect();
      const stageX = (event.clientX - (stageRect.left + stageRect.width / 2)) / stageRect.width;
      const stageY = (event.clientY - (stageRect.top + stageRect.height / 2)) / stageRect.height;
      const rotateY = Math.max(-1, Math.min(1, stageX)) * 8;
      const rotateX = Math.max(-1, Math.min(1, -stageY)) * 7;

      coreStage.style.setProperty("--rotate-y", `${rotateY}deg`);
      coreStage.style.setProperty("--rotate-x", `${rotateX}deg`);
      targetRotationY = stageX * .42;
      targetRotationX = .2 + stageY * -.25;
    }

    document.querySelectorAll(".float-card").forEach(card => {
      if (coarsePointer || reducedMotion) return;
      const depth = Number(card.dataset.depth || 1);
      const x = (normalizedX - .5) * depth * 15;
      const y = (normalizedY - .5) * depth * 11;
      card.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });

    cursorX = event.clientX;
    cursorY = event.clientY;
    if (document.body.classList.contains("intro-complete")) {
      document.body.classList.add("cursor-ready");
    }
  }

  window.addEventListener("pointermove", handlePointerMove);

  hero.addEventListener("pointerleave", () => {
    heroPointer.active = false;
    if (coreStage) {
      coreStage.style.setProperty("--rotate-y", "0deg");
      coreStage.style.setProperty("--rotate-x", "0deg");
    }
    document.querySelectorAll(".float-card").forEach(card => {
      card.style.transform = "";
    });
  });

  document.querySelectorAll(".interactive, a, button").forEach(element => {
    element.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
    element.addEventListener("pointerleave", () => document.body.classList.remove("cursor-hover"));
  });

  // Magnetic elements
  document.querySelectorAll(".magnetic").forEach(element => {
    element.addEventListener("pointermove", event => {
      if (coarsePointer || reducedMotion) return;
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * .14}px, ${y * .18}px)`;
    });

    element.addEventListener("pointerleave", () => {
      element.style.transform = "";
    });
  });

  // ---------------------------------------------------------
  // Living telemetry
  // ---------------------------------------------------------
  function updateTelemetry() {
    if (telemetryTemp) {
      telemetryTemp.textContent = `${(30.8 + Math.random() * 1.2).toFixed(1)}°`;
    }
    if (telemetrySync) {
      telemetrySync.textContent = `${(99.2 + Math.random() * .7).toFixed(1)}%`;
    }
  }

  // ---------------------------------------------------------
  // Initialise
  // ---------------------------------------------------------
  function init() {
    resizeHeroCanvas();
    buildSpherePoints();
    resizeCoreCanvas();

    if (!reducedMotion) {
      heroAnimationFrame = requestAnimationFrame(drawHeroNetwork);
    } else {
      drawHeroNetwork(0);
    }

    coreAnimationFrame = requestAnimationFrame(drawCore);

    if (!coarsePointer) {
      cursorAnimationFrame = requestAnimationFrame(animateCursor);
    }

    setInterval(updateTelemetry, 1900);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeHeroCanvas();
      resizeCoreCanvas();
    }, 120);
  });

  Promise.resolve(document.fonts?.ready)
    .catch(() => undefined)
    .finally(init);
})();
