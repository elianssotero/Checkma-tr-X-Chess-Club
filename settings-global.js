
(function () {
  var root = document.documentElement;

  var theme = localStorage.getItem("checkmaitrex_theme") || "dark";
  root.setAttribute("data-theme", theme);

  var fontSize =
    localStorage.getItem("checkmaitrex_font_size") || "medium";
  root.setAttribute("data-font-size", fontSize);

  var animations = localStorage.getItem("checkmaitrex_animations");
  if (animations === "off") {
    root.setAttribute("data-animations", "off");
  } else {
    root.removeAttribute("data-animations");
  }
})();
