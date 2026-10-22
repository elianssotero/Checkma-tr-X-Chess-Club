/* =====================================
   SITE ANIMATIONS — Auto-applies scroll
   reveal and page-load animations to
   common elements on pages that don't
   already have them.
   ===================================== */
(function () {
  "use strict";

  var autoSelectors = [
    ".card", ".activity-card", ".event-card", ".tournament-card",
    ".topic-card", ".info-card", ".social-card", ".leadership-card",
    ".principles-list li", ".process-list li", ".faq-item", ".notice",
    ".intro-panel", ".growth-panel", ".panel",
    ".story-section", ".story-section-content", ".story-image", ".story-closing-content",
    ".activities-future-panel", ".events-community-panel",
    ".tournament-notice", ".tournament-value",
    ".mv-section", ".mv-commitment",
    ".leadership-founder", ".leadership-philosophy", ".leadership-future",
    ".membership-hero", ".intro-grid", ".benefits-section",
    ".contact-panels", ".form-wrap",
    ".hero", ".faq-hero", ".faq-intro", ".faq-contact"
  ];

var style = document.createElement("style");
  style.textContent = [
    "/* Scroll Reveal */",
    ".sa-reveal{opacity:0;transform:translateY(28px);transition:opacity .6s cubic-bezier(.22,1,.36,1),transform .6s cubic-bezier(.22,1,.36,1)}",
    ".sa-reveal.sa-visible{opacity:1;transform:translateY(0)}",
    ".sa-reveal:nth-child(1){transition-delay:.04s}",
    ".sa-reveal:nth-child(2){transition-delay:.08s}",
    ".sa-reveal:nth-child(3){transition-delay:.12s}",
    ".sa-reveal:nth-child(4){transition-delay:.16s}",
    ".sa-reveal:nth-child(5){transition-delay:.20s}",
    ".sa-reveal:nth-child(6){transition-delay:.24s}",
    ".sa-reveal:nth-child(7){transition-delay:.28s}",
    ".sa-reveal:nth-child(8){transition-delay:.32s}",
    "@keyframes saPageIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}",
    ".sa-page-in{animation:saPageIn .5s ease both}",
    "@media (prefers-reduced-motion:reduce){",
    "  .sa-reveal{opacity:1!important;transform:none!important;transition:none!important}",
    "  .sa-page-in{animation:none!important}",
    "}"
].join("\n");
  document.head.appendChild(style);

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  autoSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.classList.contains("sa-reveal") || el.classList.contains("reveal") || el.classList.contains("mv-reveal")) return;
      el.classList.add("sa-reveal");
    });
  });

  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll(".sa-reveal").forEach(function (el) {
      el.classList.add("sa-visible");
    });
    return;
  }
var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("sa-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".sa-reveal").forEach(function (el) {
    observer.observe(el);
  });

  var main = document.querySelector("main") || document.querySelector(".chat-container");
  if (main && !reduceMotion) {
    main.classList.add("sa-page-in");
  }
})();
