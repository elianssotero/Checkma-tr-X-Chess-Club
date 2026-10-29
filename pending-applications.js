
/*
 * CheckmaîtréX Chess Club
 * Pending Membership Applications
 *
 * File: pending-applications.js
 *
 * Read-only pending applications view.
 * Review actions remain in membership-applications.js.
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
    return emptyState("There are no pending applications matching your search.");
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
      <h2>Pending Applications</h2>
      <p>
        Track applications that have not yet received an administrator decision.
        Use the Membership Applications tab to review them.
      </p>
    </header>

    <div class="mum-toolbar">
      <input
        class="mum-search"
        id="pendingApplicationSearch"
        type="search"
        aria-label="Search pending applications"
        placeholder="Search applicant or Membership ID…"
        value="${escapeHTML(searchQuery)}">

      <button
        class="mum-button"
        id="refreshPendingApplications"
        type="button">
        Refresh
      </button>
    </div>

    <p>
      Showing ${filtered.length} of ${applications.length} pending applications.
    </p>

    <div id="pendingApplicationTable">
      ${renderRows(filtered)}
    </div>
  `;

  document.getElementById("pendingApplicationSearch")
    ?.addEventListener("input", event => {
      searchQuery = event.target.value;
      const position = event.target.selectionStart;

      render();

      const input = document.getElementById("pendingApplicationSearch");
      input?.focus();

      if (input && position !== null) {
        input.setSelectionRange(position, position);
      }
    });

  document.getElementById("refreshPendingApplications")
    ?.addEventListener("click", () => {
      void loadPendingApplications();
    });
}

async function loadPendingApplications() {
  if (!containerRef || loading) return;

  loading = true;
  const currentRequest = ++requestId;

  containerRef.innerHTML = `
    <h2>Pending Applications</h2>
    ${loadingState("Loading pending applications…")}
  `;

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("membership_applications")
      .select(
        "id, full_name, contact_email, membership_id, application_status, submitted_at"
      )
      .eq("application_status", "pending")
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    if (currentRequest !== requestId || !containerRef) return;

    applications = Array.isArray(data) ? data : [];
    render();
  } catch (error) {
    console.error("Failed to load pending applications:", error);

    if (currentRequest === requestId && containerRef) {
      containerRef.innerHTML = `
        <h2>Pending Applications</h2>

        ${errorState(
          "Could not load pending applications. Check the Supabase connection, table columns, and administrator read permissions."
        )}

        <button
          class="mum-button"
          id="retryPendingApplications"
          type="button">
          Retry
        </button>
      `;

      document.getElementById("retryPendingApplications")
        ?.addEventListener("click", () => {
          void loadPendingApplications();
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

  await loadPendingApplications();
}

export function cleanupMembershipSection() {
  requestId++;
  containerRef = null;
  applications = [];
  loading = false;
}
