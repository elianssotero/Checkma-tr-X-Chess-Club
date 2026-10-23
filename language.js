
(function () {
  "use strict";

  var LANGUAGE_KEY = "checkmaitrex_language";

  // Only text marked with data-i18n will be translated.
  var translations = {
    "About Us": "Tungkol sa Amin",
    "Contact Us": "Makipag-ugnayan",
    "Discover Our Club": "Kilalanin ang Aming Club",
    "Connect With Us": "Makipag-ugnayan sa Amin",
    "Save Changes": "I-save ang mga Pagbabago",
    "Reset Settings": "I-reset ang Settings",
    "Search settings": "Maghanap sa Settings",
    "Language": "Wika",
    "Notifications": "Mga Notification",
    "Appearance": "Hitsura",
    "Accessibility": "Accessibility",
    "Welcome to Our Club": "Maligayang Pagdating sa Aming Club"
  };

  function getLanguage() {
    try {
      var saved = localStorage.getItem(LANGUAGE_KEY);
      return saved === "fil" || saved === "Filipino"
        ? "fil"
        : "en";
    } catch (error) {
      return "en";
    }
  }

  function translatePage() {
    var language = getLanguage();

    document.documentElement.lang =
      language === "fil" ? "fil" : "en";

    document.querySelectorAll("[data-i18n]").forEach(function (element) {
      var key = element.getAttribute("data-i18n");

      if (!element.hasAttribute("data-i18n-original")) {
        element.setAttribute("data-i18n-original", element.textContent);
      }

      var original = element.getAttribute("data-i18n-original");

      if (language === "fil" && translations[key]) {
        element.textContent = translations[key];
      } else {
        element.textContent = original;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(
      function (element) {
        var key = element.getAttribute("data-i18n-placeholder");

        if (!element.hasAttribute("data-i18n-placeholder-original")) {
          element.setAttribute(
            "data-i18n-placeholder-original",
            element.getAttribute("placeholder") || ""
          );
        }

        var original = element.getAttribute(
          "data-i18n-placeholder-original"
        );

        element.setAttribute(
          "placeholder",
          language === "fil" && translations[key]
            ? translations[key]
            : original
        );
      }
    );
  }

  function saveLanguage(value) {
    var language =
      value === "fil" ||
      value === "Filipino" ||
      value === "fil-PH"
        ? "fil"
        : "en";

    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.warn("Unable to save language preference.", error);
    }

    translatePage();
  }

  // Connect to common language-selector formats.
  document.addEventListener("change", function (event) {
    var element = event.target;

    if (
      element.matches(
        '[data-language-selector], #language, #languageSelect, ' +
        '#language-select, select[name="language"]'
      )
    ) {
      saveLanguage(element.value);
    }
  });

  // Apply the saved language when the page loads.
  translatePage();

  // Allow other scripts to request a language refresh.
  window.checkmaitrexTranslate = translatePage;
})();
