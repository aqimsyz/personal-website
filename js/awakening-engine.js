(() => {
  "use strict";

  const config = window.PORTFOLIO_CONFIG || {};
  const loaderConfig = config.loader || {};
  const ownerName = config.ownerName || "SYAZWAN AQIM";

  const loader = document.querySelector("#loader");
  const canvas = document.querySelector("#loader-canvas");
  const message = document.querySelector("#loader-message");
  const progressBar = document.querySelector("#loader-progress-bar");
  const skipButton = document.querySelector("#skip-intro");
  const flash = document.querySelector("#loader-flash");
  const metricCore = document.querySelector("#metric-core");
  const metricNetwork = document.querySelector("#metric-network");
  const metricIdentity = document.querySelector("#metric-identity");

  if (!loader || !canvas) return;

  document.body.classList.add("is-loading");

  const ctx = canvas.getContext("2d", { alpha: true });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const isMobile = window.matchMedia("(max-width: 700px)").matches;
  const particleCount = reducedMotion
    ? 90
    : (isMobile
        ? (loaderConfig.particleCountMobile || 240)
        : (loaderConfig.particleCountDesktop || 520));

  const particles = [];
  const textTargets = [];
  const mouse = { x: -9999, y: -9999, active: false };
  let width = 0;
  let height = 0;
  let phase = "network";
  let phaseProgress = 0;
  let running = true;
  let animationFrame = 0;
  let startTime = performance.now();
  let exitStarted = false;

  const colors = {
    cyan: "34, 211, 238",
    blue: "79, 140, 255",
    purple: "139, 92, 246",
    white: "245, 251, 255"
  };

  class Particle {
    constructor(index) {
      this.index = index;
      this.reset();
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.tx = this.x;
      this.ty = this.y;
    }

    reset() {
      this.x = width * 0.5;
      this.y = height * 0.5;
      this.vx = (Math.random() - 0.5) * 1.1;
      this.vy = (Math.random() - 0.5) * 1.1;
      this.size = Math.random() * 1.7 + 0.55;
      this.alpha = Math.random() * 0.58 + 0.25;
      this.depth = Math.random() * 0.7 + 0.3;
      this.angle = Math.random() * Math.PI * 2;
      this.radius = Math.random() * Math.min(width, height) * 0.4;
      this.burstPower = Math.random() * 7 + 4;
      this.color = Math.random() > 0.82 ? colors.purple : colors.cyan;
    }

    updateNetwork() {
      this.x += this.vx * this.depth;
      this.y += this.vy * this.depth;

      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        const radius = 135;

        if (distance < radius && distance > 0) {
          const force = (radius - distance) / radius;
          this.x += (dx / distance) * force * 2.8;
          this.y += (dy / distance) * force * 2.8;
        }
      }
    }

    updateCore(progress) {
      const centerX = width / 2;
      const centerY = height / 2 - 42;
      const spiralRadius = 58 + (this.index % 9) * 7;
      const speed = 0.0035 + (this.index % 6) * 0.00045;
      const theta = this.angle + performance.now() * speed;
      const targetX = centerX + Math.cos(theta) * spiralRadius;
      const targetY = centerY + Math.sin(theta) * spiralRadius * 0.62;

      const pull = 0.018 + progress * 0.055;
      this.vx += (targetX - this.x) * pull * 0.018;
      this.vy += (targetY - this.y) * pull * 0.018;
      this.vx *= 0.92;
      this.vy *= 0.92;
      this.x += this.vx;
      this.y += this.vy;
    }

    updateText(progress) {
      const target = textTargets[this.index % textTargets.length];
      if (!target) return;

      const ease = 0.035 + progress * 0.07;
      this.vx += (target.x - this.x) * ease;
      this.vy += (target.y - this.y) * ease;
      this.vx *= 0.76;
      this.vy *= 0.76;
      this.x += this.vx;
      this.y += this.vy;
    }

    updateBurst() {
      const centerX = width / 2;
      const centerY = height / 2;
      const dx = this.x - centerX;
      const dy = this.y - centerY;
      const distance = Math.max(Math.hypot(dx, dy), 1);

      this.vx += (dx / distance) * this.burstPower * 0.38;
      this.vy += (dy / distance) * this.burstPower * 0.38;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha *= 0.965;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.shadowBlur = phase === "text" ? 11 : 5;
      ctx.shadowColor = `rgba(${this.color}, .8)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildTextTargets();
  }

  function buildTextTargets() {
    textTargets.length = 0;

    const sampleCanvas = document.createElement("canvas");
    const sampleCtx = sampleCanvas.getContext("2d", { willReadFrequently: true });
    const sampleWidth = Math.min(1280, Math.max(700, width));
    const sampleHeight = 280;

    sampleCanvas.width = sampleWidth;
    sampleCanvas.height = sampleHeight;

    const fontSize = isMobile
      ? Math.max(38, Math.min(62, width * 0.115))
      : Math.max(68, Math.min(118, width * 0.07));

    sampleCtx.clearRect(0, 0, sampleWidth, sampleHeight);
    sampleCtx.fillStyle = "#fff";
    sampleCtx.textAlign = "center";
    sampleCtx.textBaseline = "middle";
    sampleCtx.font = `700 ${fontSize}px "Space Grotesk", Inter, sans-serif`;
    sampleCtx.fillText(ownerName, sampleWidth / 2, sampleHeight / 2);

    const image = sampleCtx.getImageData(0, 0, sampleWidth, sampleHeight);
    const step = isMobile ? 5 : 4;
    const rawPoints = [];

    for (let y = 0; y < sampleHeight; y += step) {
      for (let x = 0; x < sampleWidth; x += step) {
        const alpha = image.data[(y * sampleWidth + x) * 4 + 3];
        if (alpha > 150) rawPoints.push({ x, y });
      }
    }

    const maxWidth = Math.min(width * 0.84, 1120);
    const scale = maxWidth / sampleWidth;
    const offsetX = (width - sampleWidth * scale) / 2;
    const offsetY = height * 0.5 - (sampleHeight * scale) / 2;

    if (rawPoints.length === 0) {
      textTargets.push({ x: width / 2, y: height / 2 });
      return;
    }

    for (let i = 0; i < particleCount; i++) {
      const point = rawPoints[Math.floor((i / particleCount) * rawPoints.length)];
      textTargets.push({
        x: offsetX + point.x * scale + (Math.random() - 0.5) * 2,
        y: offsetY + point.y * scale + (Math.random() - 0.5) * 2
      });
    }
  }

  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(i));
    }
  }

  function drawConnections() {
    if (phase !== "network") return;

    const maxDistance = loaderConfig.connectionDistance || 115;
    const maxDistanceSq = maxDistance * maxDistance;

    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distanceSq = dx * dx + dy * dy;

        if (distanceSq < maxDistanceSq) {
          const opacity = (1 - distanceSq / maxDistanceSq) * 0.16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${colors.cyan}, ${opacity})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }
  }

  function drawCoreEnergy() {
    if (phase !== "core") return;

    const x = width / 2;
    const y = height / 2 - 42;
    const radius = 60 + Math.sin(performance.now() * 0.004) * 5;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 2.2);

    gradient.addColorStop(0, "rgba(255,255,255,.85)");
    gradient.addColorStop(.12, "rgba(34,211,238,.75)");
    gradient.addColorStop(.48, "rgba(79,140,255,.2)");
    gradient.addColorStop(1, "rgba(139,92,246,0)");

    ctx.beginPath();
    ctx.arc(x, y, radius * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  function setMetric(element, value) {
    if (element) element.textContent = `${String(Math.round(value)).padStart(2, "0")}%`;
  }

  function setStep(index, progress) {
    const messages = loaderConfig.messages || [
      "INITIALIZING SYSTEM CORE",
      "CALIBRATING PARTICLE NETWORK",
      "SYNCHRONIZING DIGITAL IDENTITY",
      "RECONSTRUCTING DIGITAL PROFILE",
      "EXPERIENCE READY"
    ];

    if (message) message.textContent = messages[index] || messages[messages.length - 1];
    if (progressBar) progressBar.style.width = `${progress}%`;

    setMetric(metricCore, Math.min(100, progress * 1.25));
    setMetric(metricNetwork, Math.min(100, Math.max(0, (progress - 12) * 1.3)));
    setMetric(metricIdentity, Math.min(100, Math.max(0, (progress - 48) * 1.9)));
  }

  function animate(now) {
    if (!running) return;

    const elapsed = now - startTime;
    ctx.clearRect(0, 0, width, height);

    if (phase === "network") {
      phaseProgress = Math.min(1, elapsed / 2200);
      particles.forEach(p => p.updateNetwork());
      drawConnections();
      setStep(elapsed < 900 ? 0 : 1, 8 + phaseProgress * 28);

      if (elapsed >= 2200) {
        phase = "core";
        phaseProgress = 0;
      }
    } else if (phase === "core") {
      phaseProgress = Math.min(1, (elapsed - 2200) / 1700);
      particles.forEach(p => p.updateCore(phaseProgress));
      drawCoreEnergy();
      setStep(2, 36 + phaseProgress * 25);

      if (elapsed >= 3900) {
        phase = "text";
        loader.classList.add("is-name-phase");
        phaseProgress = 0;
      }
    } else if (phase === "text") {
      phaseProgress = Math.min(1, (elapsed - 3900) / 2100);
      particles.forEach(p => p.updateText(phaseProgress));
      setStep(3, 61 + phaseProgress * 31);

      if (elapsed >= 6000) {
        phase = "hold";
        phaseProgress = 0;
      }
    } else if (phase === "hold") {
      particles.forEach(p => p.updateText(1));
      setStep(4, 100);

      if (elapsed >= 6900) {
        startExit();
      }
    } else if (phase === "burst") {
      particles.forEach(p => p.updateBurst());
    }

    particles.forEach(p => p.draw());
    animationFrame = requestAnimationFrame(animate);
  }

  function startExit() {
    if (exitStarted) return;
    exitStarted = true;
    phase = "burst";
    loader.classList.add("is-exiting");
    flash?.classList.add("is-active");

    setTimeout(() => {
      loader.style.transition = "opacity 850ms cubic-bezier(.16,1,.3,1), transform 1100ms cubic-bezier(.16,1,.3,1)";
      loader.style.opacity = "0";
      loader.style.transform = "scale(1.045)";
    }, 180);

    setTimeout(() => {
      running = false;
      cancelAnimationFrame(animationFrame);
      loader.classList.add("is-hidden");
      document.body.classList.remove("is-loading");
      document.body.classList.add("intro-complete");
      window.dispatchEvent(new CustomEvent("portfolio:intro-complete"));
    }, 1150);
  }

  function skipIntro() {
    startExit();
  }

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    mouse.active = true;
  });

  window.addEventListener("pointerleave", () => {
    mouse.active = false;
  });

  skipButton?.addEventListener("click", skipIntro);

  Promise.resolve(document.fonts?.ready)
    .catch(() => undefined)
    .finally(() => {
      resizeCanvas();
      createParticles();

      if (reducedMotion) {
        phase = "text";
        loader.classList.add("is-name-phase");
        startTime = performance.now() - 4500;
      }

      animationFrame = requestAnimationFrame(animate);
    });
})();
