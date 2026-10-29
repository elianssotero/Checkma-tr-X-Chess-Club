
/*
 * CheckmaîtréX Chess Club
 * Rejected Membership Applications
 *
 * File: rejected-applications.js
 *
 * Read-only view. Rejected records are preserved.
 */

import {
  getSupabaseClient,
  escapeHTML,
  formatDate,
  statusBadge,
  emptyState,
  loadingState,
  errorState
} from "./membership-shared.js";

let containerRef = null;
let applications = [];
let searchQuery = "";
let loading = false;
let requestId = 0;

function matchesSearch(application) {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return true;

  return [
    application.full_name,
    application.contact_email,
    application.membership_id
  ].some(value =>
    String(value ?? "").toLowerCase().includes(query)
  );
}

function renderRows(rows) {
  if (!rows.length) {
    return emptyState("No rejected applications match your search.");
  }

  return `
    <div class="mum-table-wrap">
      <table class="mum-table">
        <thead>
          <tr>
            <th scope="col">Applicant</th>
            <th scope="col">Membership ID</th>
            <th scope="col">Submitted</th>
            <th scope="col">Status</th>
          </tr>
        </thead>

        <tbody>
          ${rows.map(application => `
            <tr>
              <td>
                <strong>
                  ${escapeHTML(application.full_name || "Unnamed applicant")}
                </strong>
                <br>
                <small>
                  ${escapeHTML(application.contact_email || "No contact email")}
                </small>
              </td>

              <td>
                ${escapeHTML(application.membership_id || "—")}
              </td>

              <td>
                ${escapeHTML(formatDate(application.submitted_at))}
              </td>

              <td>
                ${statusBadge(application.application_status)}
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function render() {
  if (!containerRef) return;

  const filtered = applications.filter(matchesSearch);

  containerRef.innerHTML = `
    <header>
      <h2>Rejected Applications</h2>
      <p>
        Review previously rejected applications. Records remain available
        for reference and are not deleted by this page.
      </p>
    </header>

    <div class="mum-toolbar">
      <input
        class="mum-search"
        id="rejectedApplicationSearch"
        type="search"
        aria-label="Search rejected applications"
        placeholder="Search applicant or Membership ID…"
        value="${escapeHTML(searchQuery)}">

      <button
        class="mum-button"
        id="refreshRejectedApplications"
        type="button">
        Refresh
      </button>
    </div>

    <p>
      Showing ${filtered.length} of ${applications.length} rejected applications.
    </p>

    <div id="rejectedApplicationTable">
      ${renderRows(filtered)}
    </div>
  `;

  document.getElementById("rejectedApplicationSearch")
    ?.addEventListener("input", event => {
      searchQuery = event.target.value;
      const position = event.target.selectionStart;

      render();

      const input = document.getElementById("rejectedApplicationSearch");
      input?.focus();

      if (input && position !== null) {
        input.setSelectionRange(position, position);
      }
    });

  document.getElementById("refreshRejectedApplications")
    ?.addEventListener("click", () => {
      void loadRejectedApplications();
    });
}

async function loadRejectedApplications() {
  if (!containerRef || loading) return;

  loading = true;
  const currentRequest = ++requestId;

  containerRef.innerHTML = `
    <h2>Rejected Applications</h2>
    ${loadingState("Loading rejected applications…")}
  `;

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("membership_applications")
      .select(
        "id, full_name, contact_email, membership_id, application_status, submitted_at"
      )
      .eq("application_status", "rejected")
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    if (currentRequest !== requestId || !containerRef) return;

    applications = Array.isArray(data) ? data : [];
    render();
  } catch (error) {
    console.error("Failed to load rejected applications:", error);

    if (currentRequest === requestId && containerRef) {
      containerRef.innerHTML = `
        <h2>Rejected Applications</h2>

        ${errorState(
          "Could not load rejected applications. Check the Supabase connection, table columns, and administrator read permissions."
        )}

        <button
          class="mum-button"
          id="retryRejectedApplications"
          type="button">
          Retry
        </button>
      `;

      document.getElementById("retryRejectedApplications")
        ?.addEventListener("click", () => {
          void loadRejectedApplications();
        });
    }
  } finally {
    loading = false;
  }
}

export async function renderMembershipSection(container) {
  containerRef = container;
  applications = [];
  searchQuery = "";

  await loadRejectedApplications();
}

export function cleanupMembershipSection() {
  requestId++;
  containerRef = null;
  applications = [];
  loading = false;
}
