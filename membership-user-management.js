/*
 * CheckmaîtréX Chess Club
 * Membership & User Management Controller
 *
 * File: admin/membership-user-management.js
 */

import {
  verifyAdminAccess,
  showToast,
  loadingState,
  errorState
} from "./membership-shared.js";

const panel = document.getElementById("panelContent");
const tabs = Array.from(document.querySelectorAll(".mum-tab"));

const modules = {
  applications: "./membership-applications.js",
  approved: "./approved-members.js",
  pending: "./pending-applications.js",
  rejected: "./rejected-applications.js",
  disconnections: "./disconnection-requests.js",
  directory: "./member-directory.js",
  roles: "./member-roles-permissions.js",
  history: "./membership-history.js"
};

let currentModule = null;
let activePanel = null;
let requestNumber = 0;

function setActiveTab(tab) {
  for (const item of tabs) {
    const selected = item === tab;

    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  }

  panel.setAttribute("aria-labelledby", tab.id);
}

function showPanelMessage(message, type = "loading") {
  if (type === "error") {
    panel.innerHTML = errorState(message);
  } else {
    panel.innerHTML = loadingState(message);
  }
}

/**
 * Load a section only after admin access has been verified.
 *
 * Each section module must export:
 *   export async function renderMembershipSection(container)
 *
 * The module can optionally export:
 *   export function cleanupMembershipSection()
 */
async function openPanel(tab) {
  const panelName = tab.dataset.panel;
  const modulePath = modules[panelName];

  if (!modulePath) {
    showPanelMessage("This membership section is not configured yet.", "error");
    return;
  }

  const requestId = ++requestNumber;

  setActiveTab(tab);
  activePanel = panelName;

  if (currentModule?.cleanupMembershipSection) {
    try {
      currentModule.cleanupMembershipSection();
    } catch (error) {
      console.error("Membership section cleanup failed:", error);
    }
  }

  currentModule = null;
  showPanelMessage("Loading section…");

  try {
    const sectionModule = await import(modulePath);

    // Ignore a previous tab request if the user has already switched tabs.
    if (requestId !== requestNumber || activePanel !== panelName) {
      return;
    }

    if (typeof sectionModule.renderMembershipSection !== "function") {
      throw new Error(
        `The module ${modulePath} does not export renderMembershipSection().`
      );
    }

    currentModule = sectionModule;

    await sectionModule.renderMembershipSection(panel);
  } catch (error) {
    console.error(`Failed to load membership section "${panelName}":`, error);

    if (requestId === requestNumber) {
      showPanelMessage(
        "This section could not be loaded. Check the browser console and confirm that its JavaScript file exists.",
        "error"
      );
    }
  }
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => {
    void openPanel(tab);
  });

  tab.addEventListener("keydown", event => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    tabs[nextIndex].focus();
    void openPanel(tabs[nextIndex]);
  });
});

async function initializeMembershipPage() {
  if (!panel || tabs.length !== 8) {
    console.error("Membership page is missing required HTML elements.");
    return;
  }

  const allowed = await verifyAdminAccess();

  if (!allowed) {
    return;
  }

  const firstTab = tabs.find(tab => tab.dataset.panel === "applications");

  if (!firstTab) {
    showToast("The applications tab is missing.", "error");
    return;
  }

  await openPanel(firstTab);
}

void initializeMembershipPage();
