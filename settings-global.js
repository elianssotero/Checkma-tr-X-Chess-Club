
(function () {
  "use strict";

  var root = document.documentElement;

  // Apply the saved website theme.
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

  // Apply saved font size.
  var allowedSizes = ["small", "medium", "large", "xlarge"];
  var savedSize = "medium";

  try {
    savedSize = localStorage.getItem("checkmaitrex_font_size") || "medium";
  } catch (error) {
    console.warn("Unable to load saved font size.", error);
  }

  var fontSize = allowedSizes.indexOf(savedSize) !== -1
    ? savedSize
    : "medium";

  root.setAttribute("data-font-size", fontSize);

  // Apply animation preference.
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

  // Apply custom accent color across pages.
  var savedAccent = "#d4af37";

  try {
    var accent = localStorage.getItem("checkmaitrex_accent_color");

    if (/^#[0-9a-fA-F]{6}$/.test(accent || "")) {
      savedAccent = accent;
    }
  } catch (error) {
    console.warn("Unable to load saved accent color.", error);
  }

  root.style.setProperty("--gold", savedAccent);
  root.style.setProperty("--light-gold", savedAccent);
})();
