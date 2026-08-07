(() => {
  "use strict";

  const aboutSection = document.querySelector("#about");
  const aboutIntro = aboutSection?.querySelector(".about-intro-grid");
  const zone = document.querySelector("#about-hanging-zone");
  const body = document.querySelector("#about-hanging-card-body");
  const card = document.querySelector("#about-profile-card");
  const rope = document.querySelector("#about-lanyard-path");
  const ropeHighlight = document.querySelector("#about-lanyard-highlight");
  const lanyardSvg = document.querySelector(".about-lanyard-svg");
  const lanyardAnchor = document.querySelector(".about-lanyard-anchor");
  const navbar = document.querySelector("#navbar") || document.querySelector(".navbar");
  const name = document.querySelector("#about-card-name");

  if (
    !aboutSection ||
    !aboutIntro ||
    !zone ||
    !body ||
    !card ||
    !rope ||
    !ropeHighlight ||
    !lanyardSvg ||
    !lanyardAnchor ||
    !navbar
  ) return;

  // Promote the rope and clamp to the document level so the lanyard can
  // visibly originate from the fixed navbar instead of the About card column.
  document.body.append(lanyardSvg, lanyardAnchor);

  // Add repeated UiTM branding directly onto the live SVG rope path.
  // This is created in JavaScript so no HTML structure change is needed.
  const svgNamespace = "http://www.w3.org/2000/svg";
  const lanyardText = document.createElementNS(svgNamespace, "text");
  const lanyardTextPath = document.createElementNS(svgNamespace, "textPath");

  lanyardText.classList.add("about-lanyard-text");
  lanyardText.setAttribute("aria-hidden", "true");
  lanyardText.setAttribute("dy", "2.65");

  lanyardTextPath.setAttribute("href", "#about-lanyard-path");
  lanyardTextPath.setAttributeNS(
    "http://www.w3.org/1999/xlink",
    "xlink:href",
    "#about-lanyard-path"
  );
  lanyardTextPath.setAttribute("startOffset", "50%");
  lanyardTextPath.setAttribute("text-anchor", "middle");
  lanyardTextPath.textContent = "UiTM     •     UiTM";

  lanyardText.append(lanyardTextPath);
  lanyardSvg.append(lanyardText);

  if (name && window.PORTFOLIO_CONFIG?.ownerName) {
    name.textContent = window.PORTFOLIO_CONFIG.ownerName;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    angle: 0,
    angularVelocity: 0,
    dragging: false,
    active: false,
    launched: false,
    pointerId: null,
    targetX: 0,
    targetY: 0,
    dragOffsetX: 0,
    dragOffsetY: 0,
    pointerVelocityX: 0,
    pointerVelocityY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    lastPointerTime: 0,
    releasedAt: 0,
    settledFrames: 0,
    presence: "hidden",
    ropeScale: 1,
    ropeScaleVelocity: 0,
    ropeTarget: 1,
    exitTimer: 0,
    enterTimer: 0
  };

  const geometry = {
    width: 1,
    height: 1,
    cardWidth: 1,
    cardHeight: 1,
    anchorX: 0,
    anchorY: 0,
    anchorViewportX: 0,
    anchorViewportY: 0,
    zoneViewportLeft: 0,
    zoneViewportTop: 0,
    ropeLength: 175,
    centerDistance: 360,
    restX: 0,
    restY: 0
  };

  let frame = 0;
  let previousTime = performance.now();
  let accumulator = 0;
  const fixedStep = 1 / 120;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function syncNavbarAnchor(preserveRelativePosition = true) {
    const zoneRect = zone.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();

    const previousAnchorX = geometry.anchorX;
    const previousAnchorY = geometry.anchorY;

    const desiredViewportX = clamp(
      zoneRect.left + zoneRect.width * .5,
      navbarRect.left + 92,
      navbarRect.right - 92
    );
    const desiredViewportY = navbarRect.bottom + 14;

    geometry.zoneViewportLeft = zoneRect.left;
    geometry.zoneViewportTop = zoneRect.top;
    geometry.anchorViewportX = desiredViewportX;
    geometry.anchorViewportY = desiredViewportY;
    geometry.anchorX = desiredViewportX - zoneRect.left;
    geometry.anchorY = desiredViewportY - zoneRect.top;

    lanyardAnchor.style.left = `${desiredViewportX}px`;
    lanyardAnchor.style.top = `${navbarRect.bottom - 7}px`;

    if (
      preserveRelativePosition &&
      state.launched &&
      Number.isFinite(previousAnchorX) &&
      Number.isFinite(previousAnchorY)
    ) {
      state.x += geometry.anchorX - previousAnchorX;
      state.y += geometry.anchorY - previousAnchorY;
    }
  }

  function measure(preservePosition = true) {
    const cardRect = card.getBoundingClientRect();
    const oldWidth = geometry.width;
    const oldHeight = geometry.height;

    geometry.width = Math.max(1, zone.clientWidth);
    geometry.height = Math.max(1, zone.clientHeight);
    geometry.cardWidth = Math.max(1, card.offsetWidth || cardRect.width);
    geometry.cardHeight = Math.max(1, card.offsetHeight || cardRect.height);
    geometry.ropeLength = clamp(geometry.height * .27, 142, 205);

    // Distance from navbar anchor to the card centre when the strap is taut.
    // The extra 7px places the SVG endpoint inside the clip slot.
    geometry.centerDistance =
      geometry.ropeLength +
      geometry.cardHeight * .5 +
      7;

    if (preservePosition && oldWidth > 1 && oldHeight > 1) {
      state.x *= geometry.width / oldWidth;
      state.y *= geometry.height / oldHeight;
    }

    syncNavbarAnchor(preservePosition);
    geometry.restX = geometry.anchorX;
    geometry.restY = geometry.anchorY + geometry.centerDistance;
  }

  function launchDrop() {
    measure(false);

    state.launched = true;
    state.active = true;
    state.presence = "entering";
    state.ropeScale = reducedMotion ? 1 : .34;
    state.ropeScaleVelocity = 0;
    state.ropeTarget = 1;
    state.x = geometry.anchorX + Math.min(geometry.width * .08, 46);
    state.y =
      geometry.anchorY +
      geometry.centerDistance * state.ropeScale;
    state.vx = reducedMotion ? 0 : -42;
    state.vy = reducedMotion ? 0 : 6;
    state.angle = reducedMotion ? 0 : .17;
    state.angularVelocity = reducedMotion ? 0 : -.32;
    state.settledFrames = 0;

    zone.classList.add("is-activated", "is-entering");
    zone.classList.remove("is-leaving", "is-card-hidden", "has-returned");

    render();

    // Position everything correctly while hidden, then reveal it on the next
    // paint. This prevents the rope from visibly jumping into the navbar.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        zone.classList.add("is-present");
        lanyardSvg.classList.add("is-visible");
        lanyardAnchor.classList.add("is-visible");
        lanyardSvg.classList.remove("is-leaving");
        lanyardAnchor.classList.remove("is-leaving");
      });
    });

    clearTimeout(state.enterTimer);
    state.enterTimer = window.setTimeout(() => {
      if (state.presence !== "entering") return;
      state.presence = "visible";
      zone.classList.remove("is-entering");
    }, reducedMotion ? 10 : 1050);

    startLoop();
  }

  function attachmentPoint() {
    // The card rotates around its centre. The lanyard ends inside the
    // horizontal slot of the metal clip, so it never appears cut.
    const localY = -geometry.cardHeight / 2 - 6;

    return {
      x: state.x - Math.sin(state.angle) * localY,
      y: state.y + Math.cos(state.angle) * localY
    };
  }

  function applyPhysics(dt) {
    const gravity = 1280;
    const airDrag = Math.pow(.988, dt * 60);

    // Spring the visible strap length between its collapsed and full states.
    const ropeSpring = state.presence === "leaving" ? 34 : 25;
    const ropeDamping = state.presence === "leaving" ? 10.5 : 8.2;
    state.ropeScaleVelocity +=
      ((state.ropeTarget - state.ropeScale) * ropeSpring -
        state.ropeScaleVelocity * ropeDamping) * dt;
    state.ropeScale += state.ropeScaleVelocity * dt;
    state.ropeScale = clamp(state.ropeScale, .22, 1.035);

    const activeCenterDistance =
      geometry.centerDistance * state.ropeScale;

    if (state.dragging) {
      const followStrength = 54;
      const followDamping = 11.5;
      const desiredX = state.targetX - state.dragOffsetX;
      const desiredY = state.targetY - state.dragOffsetY;

      state.vx += ((desiredX - state.x) * followStrength - state.vx * followDamping) * dt;
      state.vy += ((desiredY - state.y) * followStrength - state.vy * followDamping) * dt;
      state.settledFrames = 0;
    } else {
      state.vy += gravity * dt;

      // A real hanging card naturally returns beneath its anchor. This gentle
      // tangential restoring force helps the numerical simulation settle there
      // after a throw without snapping or looking scripted.
      const activeRestX = geometry.anchorX;
      const activeRestY = geometry.anchorY + activeCenterDistance;
      const restDx = activeRestX - state.x;
      const restDy = activeRestY - state.y;
      const speed = Math.hypot(state.vx, state.vy);
      const returnStrength = speed < 240 ? 2.1 : .62;

      state.vx += restDx * returnStrength * dt;
      state.vy += restDy * returnStrength * .56 * dt;
    }

    // Bilateral rope constraint: the strap stays taut whether the card is
    // pulled farther away or pushed closer to the navbar.
    let dx = state.x - geometry.anchorX;
    let dy = state.y - geometry.anchorY;
    let distance = Math.max(1, Math.hypot(dx, dy));
    let nx = dx / distance;
    let ny = dy / distance;
    const radialError = distance - activeCenterDistance;
    const radialVelocity = state.vx * nx + state.vy * ny;
    const stiffness = state.dragging ? 125 : 285;
    const damping = state.dragging ? 16 : 23;
    const constraintForce = radialError * stiffness + radialVelocity * damping;

    state.vx -= nx * constraintForce * dt;
    state.vy -= ny * constraintForce * dt;

    state.vx *= airDrag;
    state.vy *= airDrag;
    state.x += state.vx * dt;
    state.y += state.vy * dt;

    // Strong positional correction prevents visual stretching and guarantees
    // that the SVG strap endpoint remains connected to the clip while dragging.
    dx = state.x - geometry.anchorX;
    dy = state.y - geometry.anchorY;
    distance = Math.max(1, Math.hypot(dx, dy));
    nx = dx / distance;
    ny = dy / distance;

    const correction =
      (distance - activeCenterDistance) *
      (state.dragging ? .48 : .94);

    state.x -= nx * correction;
    state.y -= ny * correction;

    // Remove residual radial velocity so the body moves like a pendulum.
    const correctedRadialVelocity = state.vx * nx + state.vy * ny;
    const radialRemoval = state.dragging ? .36 : .9;
    state.vx -= nx * correctedRadialVelocity * radialRemoval;
    state.vy -= ny * correctedRadialVelocity * radialRemoval;

    // The card tilts from pendulum angle and release momentum.
    const pendulumAngle = Math.atan2(
      state.x - geometry.anchorX,
      Math.max(40, state.y - geometry.anchorY)
    );
    const targetAngle = clamp(
      pendulumAngle * .6 + state.vx * .00058,
      -.58,
      .58
    );
    const angularAcceleration =
      (targetAngle - state.angle) * 15.5 -
      state.angularVelocity * 4.15;

    state.angularVelocity += angularAcceleration * dt;
    state.angle += state.angularVelocity * dt;

    // Soft horizontal safety bounds. The rope constraint handles vertical travel.
    const halfWidth = geometry.cardWidth / 2;
    const left = halfWidth + 3;
    const right = geometry.width - halfWidth - 3;

    if (state.x < left) {
      state.x = left;
      state.vx = Math.abs(state.vx) * .26;
      state.angularVelocity += .32;
    } else if (state.x > right) {
      state.x = right;
      state.vx = -Math.abs(state.vx) * .26;
      state.angularVelocity -= .32;
    }

    state.angle = clamp(state.angle, -.68, .68);

    // Settle precisely at the original hanging position once motion becomes tiny.
    if (
      !state.dragging &&
      state.presence === "visible" &&
      Math.abs(state.ropeScale - 1) < .008
    ) {
      const restDistance = Math.hypot(
        state.x - geometry.restX,
        state.y - geometry.restY
      );
      const motion = Math.hypot(state.vx, state.vy);

      if (
        restDistance < 2.4 &&
        motion < 8 &&
        Math.abs(state.angularVelocity) < .035
      ) {
        state.settledFrames += 1;
      } else {
        state.settledFrames = 0;
      }

      if (state.settledFrames > 18) {
        state.x = geometry.restX;
        state.y = geometry.restY;
        state.vx = 0;
        state.vy = 0;
        state.angle = 0;
        state.angularVelocity = 0;
        zone.classList.add("has-returned");
      } else {
        zone.classList.remove("has-returned");
      }
    }
  }

  function render() {
    body.style.transform = `translate3d(${state.x - geometry.cardWidth / 2}px, ${state.y - geometry.cardHeight / 2}px, 0) rotate(${state.angle}rad)`;

    const zoneRect = zone.getBoundingClientRect();
    geometry.zoneViewportLeft = zoneRect.left;
    geometry.zoneViewportTop = zoneRect.top;

    const attach = attachmentPoint();
    const attachViewportX = zoneRect.left + attach.x;
    const attachViewportY = zoneRect.top + attach.y;
    const anchorViewportX = geometry.anchorViewportX;
    const anchorViewportY = geometry.anchorViewportY;

    const horizontalVelocityCurve = clamp(state.vx * .012, -18, 18);
    const verticalDistance = Math.max(50, attachViewportY - anchorViewportY);
    const controlY1 = anchorViewportY + verticalDistance * .32;
    const controlY2 = attachViewportY - verticalDistance * .22;

    const path = [
      `M ${anchorViewportX.toFixed(2)} ${anchorViewportY.toFixed(2)}`,
      `C ${(anchorViewportX + horizontalVelocityCurve).toFixed(2)} ${controlY1.toFixed(2)},`,
      `${(attachViewportX - horizontalVelocityCurve * .35).toFixed(2)} ${controlY2.toFixed(2)},`,
      `${attachViewportX.toFixed(2)} ${attachViewportY.toFixed(2)}`
    ].join(" ");

    rope.setAttribute("d", path);
    ropeHighlight.setAttribute("d", path);

  }

  function tick(time) {
    if (!state.active && !state.dragging) {
      frame = 0;
      return;
    }

    const elapsed = Math.min(.035, Math.max(0, (time - previousTime) / 1000));
    previousTime = time;
    accumulator += elapsed;

    while (accumulator >= fixedStep) {
      applyPhysics(fixedStep);
      accumulator -= fixedStep;
    }

    render();
    frame = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (reducedMotion || frame) return;
    previousTime = performance.now();
    frame = requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (!frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function localPointer(event) {
    const rect = zone.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function beginDrag(event) {
    if (reducedMotion) return;
    event.preventDefault();
    const point = localPointer(event);
    state.dragging = true;
    state.pointerId = event.pointerId;
    state.dragOffsetX = point.x - state.x;
    state.dragOffsetY = point.y - state.y;
    state.targetX = point.x;
    state.targetY = point.y;
    state.lastPointerX = point.x;
    state.lastPointerY = point.y;
    state.lastPointerTime = performance.now();
    state.pointerVelocityX = 0;
    state.pointerVelocityY = 0;
    zone.classList.add("is-dragging", "has-interacted");
    body.setPointerCapture?.(event.pointerId);
    state.active = true;
    startLoop();
  }

  function moveDrag(event) {
    if (!state.dragging || event.pointerId !== state.pointerId) return;
    const point = localPointer(event);
    const now = performance.now();
    const dt = Math.max(8, now - state.lastPointerTime) / 1000;

    state.pointerVelocityX = (point.x - state.lastPointerX) / dt;
    state.pointerVelocityY = (point.y - state.lastPointerY) / dt;
    state.targetX = point.x;
    state.targetY = point.y;
    state.lastPointerX = point.x;
    state.lastPointerY = point.y;
    state.lastPointerTime = now;
  }

  function endDrag(event) {
    if (!state.dragging || (event.pointerId != null && event.pointerId !== state.pointerId)) return;
    state.dragging = false;
    state.vx += clamp(state.pointerVelocityX, -900, 900) * .34;
    state.vy += clamp(state.pointerVelocityY, -900, 900) * .26;
    state.angularVelocity += clamp(state.pointerVelocityX * .0016, -1.4, 1.4);
    state.pointerId = null;
    state.releasedAt = performance.now();
    state.settledFrames = 0;
    zone.classList.remove("is-dragging", "has-returned");
    state.active = true;
    startLoop();
  }

  body.addEventListener("pointerdown", beginDrag);
  body.addEventListener("pointermove", moveDrag);
  body.addEventListener("pointerup", endDrag);
  body.addEventListener("pointercancel", endDrag);
  body.addEventListener("lostpointercapture", endDrag);

  body.addEventListener("keydown", event => {
    if (reducedMotion) return;
    const impulses = {
      ArrowLeft: [-125, 0],
      ArrowRight: [125, 0],
      ArrowUp: [0, -115],
      ArrowDown: [0, 115]
    };

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      state.vx += 220;
      state.angularVelocity += 1.1;
      zone.classList.add("has-interacted");
      state.active = true;
      startLoop();
      return;
    }

    if (!impulses[event.key]) return;
    event.preventDefault();
    state.vx += impulses[event.key][0];
    state.vy += impulses[event.key][1];
    zone.classList.add("has-interacted");
    state.active = true;
    startLoop();
  });

  function enterAbout() {
    clearTimeout(state.exitTimer);
    clearTimeout(state.enterTimer);

    if (state.presence === "visible" || state.presence === "entering") {
      state.active = true;
      state.ropeTarget = 1;
      zone.classList.remove("is-leaving", "is-card-hidden");
      zone.classList.add("is-present");
      lanyardSvg.classList.remove("is-leaving");
      lanyardAnchor.classList.remove("is-leaving");
      lanyardSvg.classList.add("is-visible");
      lanyardAnchor.classList.add("is-visible");
      scheduleViewportSync();
      startLoop();
      return;
    }

    // Double-frame measurement ensures the fixed navbar has its final size and
    // position before the card or strap becomes visible.
    requestAnimationFrame(() => {
      measure(false);
      render();

      requestAnimationFrame(() => {
        measure(false);
        render();
        launchDrop();
      });
    });
  }

  function leaveAbout() {
    if (state.presence === "hidden" || state.presence === "leaving") return;

    clearTimeout(state.enterTimer);

    if (state.dragging) {
      state.dragging = false;
      state.pointerId = null;
      zone.classList.remove("is-dragging");
    }

    state.presence = "leaving";
    state.ropeTarget = .28;
    state.active = true;
    state.vx *= .55;
    state.vy = Math.min(state.vy, -18);
    state.angularVelocity *= .45;

    zone.classList.add("is-leaving");
    zone.classList.remove("is-present", "is-entering");
    lanyardSvg.classList.add("is-leaving");
    lanyardAnchor.classList.add("is-leaving");
    lanyardSvg.classList.remove("is-visible");
    lanyardAnchor.classList.remove("is-visible");
    startLoop();

    state.exitTimer = window.setTimeout(() => {
      if (state.presence !== "leaving") return;

      state.presence = "hidden";
      state.active = false;
      state.ropeScale = .28;
      state.ropeScaleVelocity = 0;
      zone.classList.add("is-card-hidden");
      zone.classList.remove(
        "is-leaving",
        "is-present",
        "is-entering",
        "is-activated",
        "has-returned"
      );
      lanyardSvg.classList.remove("is-leaving", "is-visible");
      lanyardAnchor.classList.remove("is-leaving", "is-visible");
      stopLoop();
    }, reducedMotion ? 20 : 620);
  }

  let presenceEvaluationFrame = 0;

  function isAboutIntroActive() {
    const introRect = aboutIntro.getBoundingClientRect();
    const navbarRect = navbar.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Enter while the first About screen is moving into view.
    const hasEnteredViewport =
      introRect.top < viewportHeight * .82;

    // Leave before the timeline/journey becomes the main screen.
    // Requiring a meaningful amount of the intro to remain below the navbar
    // prevents the card from covering later About subsections.
    const introStillOwnsScreen =
      introRect.bottom > navbarRect.bottom + Math.min(190, viewportHeight * .22);

    return hasEnteredViewport && introStillOwnsScreen;
  }

  function evaluateAboutIntroPresence() {
    presenceEvaluationFrame = 0;

    if (isAboutIntroActive()) {
      zone.classList.remove("is-front-page-hidden");
      enterAbout();
    } else {
      zone.classList.add("is-front-page-hidden");
      leaveAbout();
    }
  }

  function schedulePresenceEvaluation() {
    if (presenceEvaluationFrame) return;
    presenceEvaluationFrame = requestAnimationFrame(evaluateAboutIntroPresence);
  }

  // IntersectionObserver wakes the evaluator efficiently, while the scroll
  // evaluator determines the exact transition point inside the About section.
  const introObserver = new IntersectionObserver(
    schedulePresenceEvaluation,
    {
      threshold: [0, .01, .15, .45, .8],
      rootMargin: "8% 0px 8% 0px"
    }
  );

  introObserver.observe(aboutIntro);

  if (reducedMotion) {
    measure(false);
    state.launched = true;
    state.ropeScale = 1;
    state.ropeTarget = 1;
    state.x = geometry.restX;
    state.y = geometry.restY;
    state.angle = 0;
    render();
  }

  let viewportSyncFrame = 0;

  function scheduleViewportSync() {
    if (viewportSyncFrame) return;

    viewportSyncFrame = requestAnimationFrame(() => {
      viewportSyncFrame = 0;
      measure(true);
      render();
    });
  }

  window.addEventListener("resize", scheduleViewportSync);
  window.addEventListener("resize", schedulePresenceEvaluation);
  window.addEventListener("scroll", scheduleViewportSync, { passive: true });
  window.addEventListener("scroll", schedulePresenceEvaluation, { passive: true });
  window.addEventListener("load", () => {
    scheduleViewportSync();
    schedulePresenceEvaluation();
  }, { once: true });

  window.addEventListener("portfolio:intro-complete", () => {
    scheduleViewportSync();
    schedulePresenceEvaluation();
  });

  Promise.resolve(document.fonts?.ready)
    .catch(() => undefined)
    .finally(() => {
      measure(false);
      render();
      schedulePresenceEvaluation();
    });

  if ("ResizeObserver" in window) {
    const layoutObserver = new ResizeObserver(scheduleViewportSync);
    layoutObserver.observe(navbar);
    layoutObserver.observe(zone);
    layoutObserver.observe(aboutIntro);
  }

  requestAnimationFrame(() => {
    scheduleViewportSync();
    schedulePresenceEvaluation();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopLoop();
    } else if (state.active) {
      startLoop();
    }
  });
})();
