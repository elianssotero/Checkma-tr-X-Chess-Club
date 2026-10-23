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
  var savedTheme = "dark";

try {
  savedTheme = localStorage.getItem("checkmaitrex_theme") || "dark";
} catch (error) {
  console.warn("Unable to load saved theme.", error);
}
  var theme = allowedThemes.indexOf(savedTheme) !== -1
    ? savedTheme
    : "dark";

  root.setAttribute("data-theme", theme);

  // Apply the saved font size.
  var allowedSizes = ["small", "medium", "large", "xlarge"];
  var savedSize = "medium";

try {
  savedSize = localStorage.getItem("checkmaitrex_font_size") || "medium";
} catch (error) {
  console.warn("Unable to load saved font size.", error);
}

  root.setAttribute("data-font-size", fontSize);

  // Apply the animation preference.
  var animations = "on";

try {
  animations = localStorage.getItem("checkmaitrex_animations") || "on";
} catch (error) {
  console.warn("Unable to load animation preference.", error);
}

  if (animations === "off") {
    root.setAttribute("data-animations", "off");
  } else {
    root.removeAttribute("data-animations");
  }
})();
