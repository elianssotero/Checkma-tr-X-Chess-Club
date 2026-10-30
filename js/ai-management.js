
/*
  CHECKMAÎTRÉX AI MANAGEMENT
  Front-end preview controller

  IMPORTANT:
  - Uses the existing Supabase client.
  - Requires an authenticated administrator.
  - Does not call the Cloudflare Worker yet.
  - Does not save configuration or knowledge permanently.
*/

"use strict";

const AIManagement = (() => {
  const state = {
    currentPage: "overview",
    knowledge: [],
    logs: [],
    config: {
      name: "CheckmaîtréX AI",
      description: "Official AI assistant of CheckmaîtréX Chess Club.",
      language: "English and Filipino",
      style: "Professional and friendly"
    }
  };

  const $ = (id) => document.getElementById(id);

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, (character) => {
      const entities = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      };
      return entities[character];
    });
  }

  function showAccessMessage(message) {
    const element = $("access-message");
    if (element) element.textContent = message;
  }

  function showAccessError(message) {
    showAccessMessage(message);

    const loader = document.querySelector(".loader");
    if (loader) loader.style.display = "none";
  }

  /*
    ADMIN AUTHENTICATION

    Uses the existing project's Supabase client:
    window.clubSupabase

    The database function is_club_admin() must already exist
    and must securely verify the authenticated user's admin role.
  */

  async function verifyAdminAccess() {
    try {
      const supabase = window.clubSupabase;

      if (!supabase) {
        throw new Error(
          "Supabase client was not found. Check supabase-client.js."
        );
      }

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      const session = sessionData?.session;

      if (!session) {
        showAccessError(
          "No active session. Please sign in through the admin login page."
        );
        return false;
      }

      const { data: isAdmin, error: adminError } =
        await supabase.rpc("is_club_admin");

      if (adminError) throw adminError;

      if (isAdmin !== true) {
        showAccessError(
          "Access denied. This page is restricted to authorized administrators."
        );
        return false;
      }

      $("access-screen").classList.add("hidden");
      $("app").classList.remove("hidden");

      return true;

    } catch (error) {
      console.error("Admin verification error:", error);

      showAccessError(
        error.message || "Unable to verify administrator access."
      );

      return false;
    }
  }

  /* NAVIGATION */

  function navigate(page) {
    const target = $(`page-${page}`);

    if (!target) return;

    state.currentPage = page;

    document.querySelectorAll(".page-section").forEach((section) => {
      section.classList.remove("active");
    });

    target.classList.add("active");

    document.querySelectorAll(".nav-item").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.page === page
      );
    });

    $("sidebar").classList.remove("open");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  function setupNavigation() {
    document.querySelectorAll(".nav-item").forEach((button) => {
      button.addEventListener("click", () => {
        navigate(button.dataset.page);
      });
    });

    document.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => {
        navigate(button.dataset.go);
      });
    });

    $("menu-toggle").addEventListener("click", () => {
      $("sidebar").classList.toggle("open");
    });
  }

  /* PREVIEW ACTIVITY LOGS */

  function addLog(activity, section) {
    state.logs.unshift({
      activity,
      section,
      time: new Date().toLocaleString(),
      environment: "Preview"
    });

    // Keep the preview session list manageable.
    if (state.logs.length > 100) {
      state.logs.pop();
    }

    renderLogs();
    updateOverview();
  }

  function renderLogs() {
    const table = $("logs-table");

    if (!state.logs.length) {
      table.innerHTML = `
        <tr>
          <td colspan="4" class="table-empty">
            No activity recorded.
          </td>
        </tr>
      `;
    } else {
      table.innerHTML = state.logs.map((log) => `
        <tr>
          <td>${escapeHTML(log.activity)}</td>
          <td>${escapeHTML(log.section)}</td>
          <td>${escapeHTML(log.time)}</td>
          <td>
            <span class="status-pill warning">
              ${escapeHTML(log.environment)}
            </span>
          </td>
        </tr>
      `).join("");
    }

    $("analytics-total").textContent = state.logs.length;
  }

  function renderOverviewActivity() {
    const container = $("overview-activity");

    if (!state.logs.length) {
      container.textContent = "No preview activity yet.";
      return;
    }

    container.innerHTML = state.logs
      .slice(0, 5)
      .map((log) => `
        <div class="permission-row">
          <div>
            <strong>${escapeHTML(log.activity)}</strong>
            <p>${escapeHTML(log.section)} · ${escapeHTML(log.time)}</p>
          </div>
          <span class="status-pill warning">Preview</span>
        </div>
      `)
      .join("");
  }

  function updateOverview() {
    $("overview-knowledge").textContent = state.knowledge.length;
    $("overview-logs").textContent = state.logs.length;

    renderOverviewActivity();
  }

  /* CHAT PREVIEW */

  function appendChatMessage(sender, message, type) {
    const container = $("chat-messages");

    const article = document.createElement("div");
    article.className = `message ${type}`;

    const avatar = document.createElement("div");
    avatar.className = "message-avatar";
    avatar.textContent = sender === "You" ? "A" : "♛";

    const bubble = document.createElement("div");
    bubble.className = "message-bubble";

    const name = document.createElement("strong");
    name.textContent = sender;

    const paragraph = document.createElement("p");
    paragraph.textContent = message;

    bubble.append(name, paragraph);
    article.append(avatar, bubble);

    container.appendChild(article);
    container.scrollTop = container.scrollHeight;
  }

  function setupChat() {
    $("chat-form").addEventListener("submit", (event) => {
      event.preventDefault();

      const input = $("chat-input");
      const message = input.value.trim();

      if (!message) return;

      appendChatMessage("You", message, "user-message");

      input.value = "";

      appendChatMessage(
        "Preview Notice",
        "Your message was added to the local testing interface only. The live CheckmaîtréX AI is not connected yet. We will connect this chat to the Cloudflare Worker after its request and response format is confirmed.",
        "assistant-message"
      );

      addLog("Sent a preview chat message", "AI Chat & Testing");
    });
  }

  /* CONFIGURATION PREVIEW */

  function setupConfiguration() {
    $("configuration-form").addEventListener("submit", (event) => {
      event.preventDefault();

      state.config.name = $("config-name").value.trim();
      state.config.description =
        $("config-description").value.trim();
      state.config.language = $("config-language").value;
      state.config.style = $("config-style").value;

      $("config-feedback").textContent =
        "Preview settings updated for this page session.";

      addLog("Updated AI preview configuration", "AI Configuration");
    });
  }

  /* KNOWLEDGE PREVIEW */

  function renderKnowledge() {
    const list = $("knowledge-list");

    $("knowledge-count").textContent =
      `${state.knowledge.length} ${state.knowledge.length === 1 ? "entry" : "entries"}`;

    if (!state.knowledge.length) {
      list.className = "knowledge-list empty-state";
      list.textContent = "No knowledge entries added.";
      updateOverview();
      return;
    }

    list.className = "knowledge-list";

    list.innerHTML = state.knowledge.map((entry) => `
      <article class="knowledge-entry">
        <h4>${escapeHTML(entry.title)}</h4>
        <span class="category">${escapeHTML(entry.category)}</span>
        <p>${escapeHTML(entry.content)}</p>
        <button
          class="delete-entry"
          type="button"
          data-delete-knowledge="${escapeHTML(entry.id)}"
        >
          Delete preview entry
        </button>
      </article>
    `).join("");

    list.querySelectorAll("[data-delete-knowledge]").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.deleteKnowledge;

        state.knowledge = state.knowledge.filter(
          (entry) => entry.id !== id
        );

        renderKnowledge();
        addLog("Deleted a preview knowledge entry", "AI Knowledge");
      });
    });

    updateOverview();
  }

  function setupKnowledge() {
    $("knowledge-form").addEventListener("submit", (event) => {
      event.preventDefault();

      const title = $("knowledge-title").value.trim();
      const category = $("knowledge-category").value;
      const content = $("knowledge-content").value.trim();

      if (!title || !content) return;

      state.knowledge.unshift({
        id: createLocalId(),
        title,
        category,
        content
      });

      $("knowledge-form").reset();

      renderKnowledge();
      addLog("Added a preview knowledge entry", "AI Knowledge");
    });
  }

  function createLocalId() {
    return (
      Date.now().toString(36) +
      Math.random().toString(36).slice(2, 8)
    );
  }

  /* ANALYTICS */

  function setupAnalytics() {
    $("clear-logs").addEventListener("click", () => {
      const confirmed = window.confirm(
        "Clear all preview activity records from this page session?"
      );

      if (!confirmed) return;

      state.logs = [];

      renderLogs();
      updateOverview();
    });
  }

  /* INITIALIZATION */

  async function init() {
    const authorized = await verifyAdminAccess();

    if (!authorized) return;

    setupNavigation();
    setupChat();
    setupConfiguration();
    setupKnowledge();
    setupAnalytics();

    renderKnowledge();
    renderLogs();
    updateOverview();

    addLog("Opened AI Management workspace", "AI Overview");
  }

  return {
    init,
    navigate
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  AIManagement.init();
});
