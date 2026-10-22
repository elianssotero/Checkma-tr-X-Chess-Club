/* =====================================
   BFCACHE FIX — Prevents black screen
   when pressing the physical back button
   on mobile devices.
   Add this script to EVERY HTML page,
   right before </body>.
   ===================================== */
window.addEventListener("pageshow", function (event) {
  if (event.persisted) {
    document.body.classList.remove(
      "page-leaving",
      "mv-leaving",
      "is-leaving",
      "leaving"
    );
    document.body.classList.add("page-loaded", "mv-loaded", "loaded");
    document.body.style.opacity = "";
    document.body.style.visibility = "";
    requestAnimationFrame(function () {
      var style = window.getComputedStyle(document.body);
      if (
        parseFloat(style.opacity) < 1 ||
        style.visibility === "hidden" ||
        style.display === "none"
      ) {
        window.location.reload();
      }
    });
  }
});
