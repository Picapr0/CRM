(function () {
  "use strict";

  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const cookie = document.getElementById("cookie");
  const cookieAccept = document.getElementById("cookie-accept");
  const toast = document.getElementById("toast");
  const casesTrack = document.getElementById("cases-track");
  const casesPrev = document.getElementById("cases-prev");
  const casesNext = document.getElementById("cases-next");

  /* Scroll header */
  function onScroll() {
    header.classList.toggle("header--scrolled", window.scrollY > 20);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  burger.addEventListener("click", () => {
    burger.classList.toggle("is-open");
    nav.classList.toggle("is-open");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      burger.classList.remove("is-open");
      nav.classList.remove("is-open");
    });
  });

  /* Smooth scroll */
  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const target = document.querySelector(el.getAttribute("data-scroll"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* Phone mask */
  function formatPhone(value) {
    const digits = value.replace(/\D/g, "");
    let d = digits;
    if (d.startsWith("8")) d = "7" + d.slice(1);
    if (!d.startsWith("7") && d.length) d = "7" + d;
    d = d.slice(0, 11);
    const parts = [
      d.slice(1, 4),
      d.slice(4, 7),
      d.slice(7, 9),
      d.slice(9, 11),
    ];
    let out = "+7";
    if (parts[0]) out += " (" + parts[0];
    if (parts[0] && parts[0].length === 3) out += ")";
    if (parts[1]) out += " " + parts[1];
    if (parts[2]) out += "-" + parts[2];
    if (parts[3]) out += "-" + parts[3];
    return out;
  }

  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
    });
    input.addEventListener("focus", () => {
      if (!input.value) input.value = "+7 ";
    });
  });

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 11;
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    setTimeout(() => toast.classList.remove("is-visible"), 4000);
  }

  function handleForm(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      form.querySelectorAll("[required]").forEach((field) => {
        if (field.type === "checkbox") {
          if (!field.checked) valid = false;
          return;
        }
        const isPhone = field.type === "tel";
        const ok = isPhone
          ? validatePhone(field.value)
          : field.value.trim().length > 0;
        field.classList.toggle("error", !ok);
        if (!ok) valid = false;
      });

      if (!valid) {
        showToast("Проверьте поля формы");
        return;
      }

      showToast("Заявка отправлена! Мы свяжемся с вами в течение дня.");
      form.reset();
    });
  }

  const heroForm = document.getElementById("hero-form");
  const ctaForm = document.getElementById("cta-form");
  if (heroForm) handleForm(heroForm);
  if (ctaForm) handleForm(ctaForm);

  /* Cookie */
  if (!localStorage.getItem("serviocrm-cookie")) {
    setTimeout(() => cookie.classList.add("is-visible"), 1200);
  }

  cookieAccept.addEventListener("click", () => {
    localStorage.setItem("serviocrm-cookie", "1");
    cookie.classList.remove("is-visible");
  });

  /* Cases slider */
  function scrollCases(dir) {
    const card = casesTrack.querySelector(".case-card");
    if (!card) return;
    const gap = 20;
    const step = card.offsetWidth + gap;
    casesTrack.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  casesPrev.addEventListener("click", () => scrollCases(-1));
  casesNext.addEventListener("click", () => scrollCases(1));

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Counter animation */
  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1400;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const valueEl = entry.target.querySelector("[data-count]");
        if (valueEl && !valueEl.dataset.done) {
          valueEl.dataset.done = "1";
          animateCount(valueEl);
        }
        statObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll(".stat").forEach((stat) => statObserver.observe(stat));
})();
