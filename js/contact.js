(() => {
  "use strict";

  const root = document.querySelector("#contact.contact-module");

  if (!root) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  const contactEmail =
    root.dataset.contactEmail?.trim() || "";

  const form = root.querySelector("#contact-form");
  const submitButton = root.querySelector("#contact-submit");
  const submitText = submitButton?.querySelector(
    ".contact-submit__text"
  );
  const status = root.querySelector("#contact-form-status");
  const message = root.querySelector("#contact-message");
  const characterCount = root.querySelector(
    "#contact-character-count"
  );

  function emailIsConfigured() {
    return (
      contactEmail &&
      !contactEmail.includes("YOUR_EMAIL") &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)
    );
  }

  function setupEmailDetails() {
    root
      .querySelectorAll("[data-contact-email-text]")
      .forEach(element => {
        element.textContent = contactEmail;
      });

    root
      .querySelectorAll("[data-contact-email-link]")
      .forEach(link => {
        link.href = emailIsConfigured()
          ? `mailto:${contactEmail}`
          : "#contact-form";
      });
  }

  function fallbackCopyText(value) {
    const temporaryInput = document.createElement("textarea");

    temporaryInput.value = value;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";

    document.body.append(temporaryInput);
    temporaryInput.select();

    try {
      document.execCommand("copy");
    } finally {
      temporaryInput.remove();
    }
  }

  function setupCopyEmail() {
    const button = root.querySelector("[data-copy-email]");
    const label = button?.querySelector("span");

    if (!button || !label) return;

    button.addEventListener("click", async () => {
      if (!emailIsConfigured()) {
        showStatus(
          "Add your email address to the data-contact-email attribute first.",
          true
        );
        return;
      }

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(contactEmail);
        } else {
          fallbackCopyText(contactEmail);
        }

        label.textContent = "COPIED";
        button.setAttribute("aria-label", "Email address copied");

        window.setTimeout(() => {
          label.textContent = "COPY";
          button.setAttribute("aria-label", "Copy email address");
        }, 1600);
      } catch {
        fallbackCopyText(contactEmail);
        label.textContent = "COPIED";

        window.setTimeout(() => {
          label.textContent = "COPY";
        }, 1600);
      }
    });
  }

  function showStatus(text, isError = false) {
    if (!status) return;

    status.textContent = text;
    status.classList.add("is-visible");
    status.classList.toggle("is-error", isError);
  }

  function clearStatus() {
    if (!status) return;

    status.textContent = "";
    status.classList.remove("is-visible", "is-error");
  }

  function updateCharacterCount() {
    if (!message || !characterCount) return;

    characterCount.textContent = String(message.value.length);
  }

  function validateForm() {
    if (!form) return false;

    let valid = true;
    const requiredFields = [
      ...form.querySelectorAll(
        "input[required], textarea[required]"
      )
    ];

    requiredFields.forEach(field => {
      const wrapper = field.closest(".contact-field");
      const fieldValid = field.checkValidity();

      wrapper?.classList.toggle("is-invalid", !fieldValid);

      if (!fieldValid) {
        valid = false;
      }
    });

    if (!valid) {
      requiredFields
        .find(field => !field.checkValidity())
        ?.focus();
    }

    return valid;
  }

  function createMailBody(data) {
    return [
      "Portfolio enquiry",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      "",
      "Message:",
      data.message,
      "",
      "—",
      "Sent from the Syazwan Aqim portfolio contact form."
    ].join("\n");
  }

  function setupForm() {
    if (!form || !submitButton || !submitText) return;

    message?.addEventListener("input", updateCharacterCount);
    updateCharacterCount();

    form
      .querySelectorAll("input, textarea")
      .forEach(field => {
        field.addEventListener("input", () => {
          field
            .closest(".contact-field")
            ?.classList.remove("is-invalid");

          clearStatus();
        });
      });

    form.addEventListener("submit", event => {
      event.preventDefault();
      clearStatus();

      if (!validateForm()) {
        showStatus(
          "Please complete all required fields using valid information.",
          true
        );
        return;
      }

      if (!emailIsConfigured()) {
        showStatus(
          "The contact email has not been configured. Replace YOUR_EMAIL@example.com in the Contact section.",
          true
        );
        return;
      }

      const data = Object.fromEntries(
        new FormData(form).entries()
      );

      const subject = encodeURIComponent(
        `[Portfolio enquiry] ${data.subject}`
      );

      const body = encodeURIComponent(
        createMailBody(data)
      );

      submitButton.disabled = true;
      submitButton.classList.add("is-loading");
      submitButton.setAttribute("aria-busy", "true");
      submitText.textContent = "PREPARING EMAIL";

      window.setTimeout(() => {
        window.location.href =
          `mailto:${contactEmail}?subject=${subject}&body=${body}`;

        showStatus(
          "Your email application has been opened with the message prepared. Please review it before sending."
        );

        submitButton.disabled = false;
        submitButton.classList.remove("is-loading");
        submitButton.removeAttribute("aria-busy");
        submitText.textContent = "SEND MESSAGE";
      }, reducedMotion ? 0 : 480);
    });
  }

  function setupMagneticActions() {
    if (!finePointer || reducedMotion) return;

    root
      .querySelectorAll(".contact-magnetic")
      .forEach(element => {
        element.addEventListener("pointermove", event => {
          const rect = element.getBoundingClientRect();

          const x =
            (event.clientX - rect.left - rect.width / 2) * 0.12;

          const y =
            (event.clientY - rect.top - rect.height / 2) * 0.12;

          element.style.setProperty(
            "--contact-magnetic-x",
            `${x}px`
          );

          element.style.setProperty(
            "--contact-magnetic-y",
            `${y}px`
          );
        });

        element.addEventListener("pointerleave", () => {
          element.style.setProperty(
            "--contact-magnetic-x",
            "0px"
          );

          element.style.setProperty(
            "--contact-magnetic-y",
            "0px"
          );
        });
      });
  }

  function setupPointerGlow() {
    if (!finePointer || reducedMotion) return;

    let frame = 0;
    let nextX = 0;
    let nextY = 0;

    root.addEventListener("pointermove", event => {
      const rect = root.getBoundingClientRect();

      nextX = event.clientX - rect.left;
      nextY = event.clientY - rect.top;

      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;

        root.style.setProperty(
          "--contact-pointer-x",
          `${nextX}px`
        );

        root.style.setProperty(
          "--contact-pointer-y",
          `${nextY}px`
        );
      });
    });
  }

  function setupReveals() {
    const items = [
      ...root.querySelectorAll(".contact-reveal")
    ];

    if (
      reducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      items.forEach(item =>
        item.classList.add("is-visible")
      );
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
      {
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    items.forEach(item => observer.observe(item));
  }

  function setupNetwork() {
    const canvas = root.querySelector("#contact-network");
    const context = canvas?.getContext("2d");

    if (!canvas || !context || reducedMotion) return;

    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let animationFrame = 0;
    let active = false;

    const pointer = {
      x: -1000,
      y: -1000,
      active: false
    };

    let nodes = [];

    function createNodes() {
      const count = Math.min(
        62,
        Math.max(
          24,
          Math.round((width * height) / 31000)
        )
      );

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.4 + 0.7,
        velocityX: (Math.random() - 0.5) * 0.19,
        velocityY: (Math.random() - 0.5) * 0.19,
        phase: Math.random() * Math.PI * 2
      }));
    }

    function resizeCanvas() {
      const rect = root.getBoundingClientRect();

      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      context.setTransform(
        pixelRatio,
        0,
        0,
        pixelRatio,
        0,
        0
      );

      createNodes();
    }

    function updateNodes() {
      nodes.forEach(node => {
        node.x += node.velocityX;
        node.y += node.velocityY;
        node.phase += 0.012;

        if (node.x < -20) node.x = width + 20;
        if (node.x > width + 20) node.x = -20;
        if (node.y < -20) node.y = height + 20;
        if (node.y > height + 20) node.y = -20;

        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < 150) {
            const influence =
              (1 - distance / 150) * 0.32;

            node.x += (dx / distance) * influence;
            node.y += (dy / distance) * influence;
          }
        }
      });
    }

    function drawConnections() {
      for (let first = 0; first < nodes.length; first += 1) {
        for (
          let second = first + 1;
          second < nodes.length;
          second += 1
        ) {
          const nodeA = nodes[first];
          const nodeB = nodes[second];

          const distance = Math.hypot(
            nodeA.x - nodeB.x,
            nodeA.y - nodeB.y
          );

          if (distance > 145) continue;

          const opacity =
            (1 - distance / 145) * 0.13;

          context.beginPath();
          context.moveTo(nodeA.x, nodeA.y);
          context.lineTo(nodeB.x, nodeB.y);
          context.strokeStyle =
            `rgba(79, 224, 188, ${opacity})`;
          context.lineWidth = 0.7;
          context.stroke();
        }
      }
    }

    function drawNodes() {
      nodes.forEach((node, index) => {
        const pulse =
          0.72 + Math.sin(node.phase) * 0.22;

        context.beginPath();
        context.arc(
          node.x,
          node.y,
          node.radius * pulse,
          0,
          Math.PI * 2
        );

        context.fillStyle =
          index % 5 === 0
            ? "rgba(139, 124, 255, 0.52)"
            : "rgba(79, 224, 188, 0.58)";

        context.fill();
      });
    }

    function render() {
      animationFrame = 0;

      if (!active || document.hidden) return;

      context.clearRect(0, 0, width, height);

      updateNodes();
      drawConnections();
      drawNodes();

      animationFrame = requestAnimationFrame(render);
    }

    function start() {
      if (animationFrame || !active) return;
      animationFrame = requestAnimationFrame(render);
    }

    function stop() {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    const visibilityObserver = new IntersectionObserver(
      entries => {
        active = Boolean(entries[0]?.isIntersecting);

        if (active) {
          start();
        } else {
          stop();
        }
      },
      {
        rootMargin: "150px 0px",
        threshold: 0
      }
    );

    visibilityObserver.observe(root);

    root.addEventListener("pointermove", event => {
      const rect = root.getBoundingClientRect();

      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    });

    root.addEventListener("pointerleave", () => {
      pointer.active = false;
    });

    window.addEventListener(
      "resize",
      resizeCanvas,
      { passive: true }
    );

    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          stop();
        } else if (active) {
          start();
        }
      }
    );

    resizeCanvas();
  }

  function setCurrentYear() {
    const year = root.querySelector(
      "#contact-current-year"
    );

    if (year) {
      year.textContent = String(
        new Date().getFullYear()
      );
    }
  }

  function initialiseContact() {
    setupEmailDetails();
    setupCopyEmail();
    setupForm();
    setupMagneticActions();
    setupPointerGlow();
    setupReveals();
    setupNetwork();
    setCurrentYear();
  }

  initialiseContact();

function setupContactTopFocus() {
  const contactSection = document.querySelector("#contact");
  if (!contactSection) return;

  let focusBlur = document.querySelector(".contact-top-focus-blur");

  if (!focusBlur) {
    focusBlur = document.createElement("div");
    focusBlur.className = "contact-top-focus-blur";
    focusBlur.setAttribute("aria-hidden", "true");
    document.body.append(focusBlur);
  }

  let frame = 0;

  const updateContactBlur = () => {
    frame = 0;

    const rect = contactSection.getBoundingClientRect();

    const isContactActive =
      rect.top <= window.innerHeight * 0.34 &&
      rect.bottom >= window.innerHeight * 0.18;

    focusBlur.classList.toggle("is-visible", isContactActive);
  };

  const scheduleContactBlurUpdate = () => {
    if (frame) return;

    frame = requestAnimationFrame(updateContactBlur);
  };

  window.addEventListener("scroll", scheduleContactBlurUpdate, {
    passive: true
  });

  window.addEventListener("resize", scheduleContactBlurUpdate, {
    passive: true
  });

  updateContactBlur();
}

setupContactTopFocus();
})();