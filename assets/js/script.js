/* ==========================================================================
   Vision Field Eye Care Services — Site scripts
   Vanilla JS: header state, mobile nav, hero slider, scrollspy,
   gallery lightbox, back-to-top, current year.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header scroll state ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add("is-scrolled");
    } else {
      header.classList.remove("is-scrolled");
    }
    toggleBackToTop();
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Scrollspy for nav links ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.getAttribute("id");
            navAnchors.forEach(function (a) {
              a.classList.toggle("is-active", a.getAttribute("href") === "#" + id);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Hero slider ---------- */
  var slides = document.querySelectorAll(".hero-slide");
  var dotsWrap = document.querySelector(".hero-slide-dots");
  var current = 0;
  var sliderTimer;

  function goToSlide(index) {
    if (!slides.length) return;
    slides[current].classList.remove("is-active");
    if (dotsWrap) dotsWrap.children[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    if (dotsWrap) dotsWrap.children[current].classList.add("is-active");
  }

  function startSlider() {
    if (slides.length < 2 || reduceMotion) return;
    sliderTimer = window.setInterval(function () {
      goToSlide(current + 1);
    }, 5500);
  }

  if (slides.length && dotsWrap) {
    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Show slide " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () {
        window.clearInterval(sliderTimer);
        goToSlide(i);
        startSlider();
      });
      dotsWrap.appendChild(dot);
    });
    startSlider();
  }

  /* ---------- Gallery lightbox ---------- */
  var galleryItems = document.querySelectorAll(".gallery-item img");
  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var lightboxClose = lightbox ? lightbox.querySelector(".lightbox-close") : null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  galleryItems.forEach(function (img) {
    img.addEventListener("click", function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  /* ---------- Back to top ---------- */
  var backToTop = document.querySelector(".float-btn--top");
  function toggleBackToTop() {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 560);
  }
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  /* ---------- Hero particles ---------- */
  function initParticles() {
    var target = document.getElementById("vf-particles");
    if (!target || typeof window.particlesJS === "undefined" || reduceMotion) return;
    window.particlesJS("vf-particles", {
      particles: {
        number: { value: 95, density: { enable: true, value_area: 900 } },
        color: { value: ["#ffffff", "#7cc6e8", "#4a9bc9"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.95,
          random: true,
          anim: { enable: true, speed: 0.5, opacity_min: 0.45, sync: false }
        },
        size: { value: 4.4, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#7cc6e8",
          opacity: 0.65,
          width: 1
        },
        move: {
          enable: true,
          speed: 0.8,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 160, line_linked: { opacity: 0.6 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
  initParticles();

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
