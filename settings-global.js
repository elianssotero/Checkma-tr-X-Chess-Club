(function () {
  "use strict";

  var root = document.documentElement;
  var allowedThemes = [
    "dark",
    "emerald",
    "royal-gold",
    "clean-minimal",
    "midnight-arena",
    "warm-wood",
    "glass-layers",
    "tournament-pro",
    "modern-editorial",
    "soft-modern",
    "neo-chess"
  ];

  // Apply the saved theme, or keep the original design by default.
  var savedTheme = localStorage.getItem("checkmaitrex_theme") || "dark";
  var theme = allowedThemes.indexOf(savedTheme) !== -1
    ? savedTheme
    : "dark";

  root.setAttribute("data-theme", theme);

  // Apply the saved font size.
  var allowedSizes = ["small", "medium", "large", "xlarge"];
  var savedSize = localStorage.getItem("checkmaitrex_font_size") || "medium";
  var fontSize = allowedSizes.indexOf(savedSize) !== -1
    ? savedSize
    : "medium";

  root.setAttribute("data-font-size", fontSize);

  // Apply the animation preference.
  var animations = localStorage.getItem("checkmaitrex_animations") || "on";

  if (animations === "off") {
    root.setAttribute("data-animations", "off");
  } else {
    root.removeAttribute("data-animations");
  }
})();
