
/*
 * CheckmaîtréX Chess Club
 * Shared Membership Management Utilities
 *
 * File: admin/membership-shared.js
 *
 * This file provides shared helpers only.
 * It does not modify membership records.
 */

export function getSupabaseClient() {
  const client = window.clubSupabase;

  if (!client) {
    throw new Error(
      "Supabase client is unavailable. Check supabase-client.js."
    );
  }

  return client;
}

/**
 * Escape text before inserting untrusted database values into HTML.
 * Prefer textContent when rendering simple text.
 */
export function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

/**
 * Verify that the visitor has a signed-in session and is a club admin.
 * This is a UI access check, not a replacement for database RLS
 * and authorization checks inside privileged database functions.
 */
export async function verifyAdminAccess() {
  const gate = document.getElementById("accessGate");
  const message = document.getElementById("accessMessage");
  const returnLink = document.getElementById("returnLink");
  const app = document.getElementById("membershipApp");
  const adminState = document.getElementById("adminState");

  function deny(reason) {
    if (message) message.textContent = reason;
    if (returnLink) returnLink.hidden = false;
    if (app) app.hidden = true;

    if (adminState) {
      adminState.textContent = "Access not granted";
      adminState.classList.remove("is-success");
      adminState.classList.add("is-error");
    }

    if (gate) gate.hidden = false;

    return false;
  }

  try {
    const supabase = getSupabaseClient();

    const {
      data: sessionData,
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!sessionData?.session) {
      return deny(
        "Please sign in to the club website with your administrator account first."
      );
    }

    const {
      data: isAdmin,
      error: adminError
    } = await supabase.rpc("is_club_admin");

    if (adminError) {
      throw adminError;
    }

    if (isAdmin !== true) {
      return deny(
        "Access denied. This account is not recognized as a club administrator."
      );
    }

    if (gate) gate.hidden = true;
    if (app) app.hidden = false;

    if (adminState) {
      adminState.textContent = "Administrator verified";
      adminState.classList.remove("is-error");
      adminState.classList.add("is-success");
    }

    return true;
  } catch (error) {
    console.error("Membership admin verification failed:", error);

    return deny(
      "Unable to verify administrator access. Please check your connection and Supabase configuration."
    );
  }
}

/**
 * Display a short notification.
 * The toast is hidden automatically when the next message is cleared.
 */
export function showToast(message, type = "success") {
  const toast = document.getElementById("toast");

  if (!toast) {
    console.info("[Membership]", message);
    return;
  }

  toast.textContent = String(message ?? "");
  toast.classList.remove("is-error", "is-success");

  if (type === "error") {
    toast.classList.add("is-error");
  } else {
    toast.classList.add("is-success");
  }

  toast.hidden = false;
}

/**
 * Format a database timestamp for display.
 */
export function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Manila"
  }).format(date);
}

/**
 * Normalize a status value for comparison and display.
 */
export function normalizeStatus(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

/**
 * Return a safe CSS class suffix for known membership statuses.
 */
export function statusClass(value) {
  const status = normalizeStatus(value);

  const knownStatuses = {
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
    active: "approved",
    inactive: "rejected",
    disconnected: "rejected"
  };

  return knownStatuses[status] ?? "";
}

/**
 * Build a status badge.
 * The status is escaped before it is inserted into HTML.
 */
export function statusBadge(value) {
  const status = normalizeStatus(value);
  const suffix = statusClass(status);
  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return `
    <span class="mum-badge ${suffix ? `mum-badge-${suffix}` : ""}">
      ${escapeHTML(label)}
    </span>
  `;
}

/**
 * Render a standard empty-state message.
 */
export function emptyState(message = "No records found.") {
  return `
    <div class="mum-empty">
      ${escapeHTML(message)}
    </div>
  `;
}

/**
 * Render a standard loading message.
 */
export function loadingState(message = "Loading records…") {
  return `
    <div class="mum-loading">
      ${escapeHTML(message)}
    </div>
  `;
}

/**
 * Render a standard error message.
 */
export function errorState(message = "Unable to load records.") {
  return `
    <div class="mum-error">
      ${escapeHTML(message)}
    </div>
  `;
}

/**
 * Read a Supabase query result and throw its error when present.
 */
export function requireQueryData(result) {
  if (!result) {
    throw new Error("The database returned no response.");
  }

  if (result.error) {
    throw result.error;
  }

  return result.data;
}
