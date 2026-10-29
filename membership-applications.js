
/*
 * CheckmaîtréX Chess Club
 * Membership Applications
 *
 * File: membership-applications.js
 *
 * Uses the existing review_membership_application RPC.
 * Does not create Auth users or assign new Membership IDs.
 */

import {
  getSupabaseClient,
  escapeHTML,
  formatDate,
  statusBadge,
  emptyState,
  loadingState,
  errorState,
  showToast
} from "./membership-shared.js";

let currentContainer = null;
let currentApplications = [];
let searchTerm = "";
let statusFilter = "all";
let loading = false;
let lastRequest = 0;

function applicationStatus(application) {
  return String(application.application_status ?? "")
    .trim()
    .toLowerCase();
}

function matchesFilters(application) {
  const status = applicationStatus(application);

  if (statusFilter !== "all" && status !== statusFilter) {
    return false;
  }

  const query = searchTerm.trim().toLowerCase();

  if (!query) return true;

  const searchableValues = [
    application.full_name,
    application.contact_email,
    application.membership_id,
    application.id
  ];

  return searchableValues.some(value =>
    String(value ?? "").toLowerCase().includes(query)
  );
}

function renderRows(applications) {
  if (!applications.length) {
    return emptyState("No membership applications match your filters.");
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
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${applications.map(application => {
            const status = applicationStatus(application);
            const canReview = status === "pending";

            return `
              <tr>
                <td>
                  <strong>${escapeHTML(application.full_name || "Unnamed applicant")}</strong>
                  <br>
                  <small>${escapeHTML(application.contact_email || "No contact email")}</small>
                </td>

                <td>${escapeHTML(application.membership_id || "—")}</td>

                <td>${escapeHTML(formatDate(application.submitted_at))}</td>

                <td>${statusBadge(status)}</td>

                <td>
                  ${
                    canReview
                      ? `
                        <div class="mum-actions">
                          <button
                            class="mum-button mum-button-primary"
                            type="button"
                            data-review="approved"
                            data-id="${escapeHTML(application.id)}">
                            Approve
                          </button>

                          <button
                            class="mum-button mum-button-danger"
                            type="button"
                            data-review="rejected"
                            data-id="${escapeHTML(application.id)}">
                            Reject
                          </button>
                        </div>
                      `
                      : `<span class="mum-badge">Reviewed</span>`
                  }
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderContent() {
  if (!currentContainer) return;

  const filtered = currentApplications.filter(matchesFilters);

  currentContainer.innerHTML = `
    <header>
      <h2>Membership Applications</h2>
      <p>
        Review applications submitted by club members and applicants.
        Approval is required before an application becomes approved.
      </p>
    </header>

    <div class="mum-toolbar">
      <input
        class="mum-search"
        type="search"
        id="applicationSearch"
        placeholder="Search name, email, Membership ID…"
        aria-label="Search membership applications"
        value="${escapeHTML(searchTerm)}">

      <select
        class="mum-select"
        id="applicationStatusFilter"
        aria-label="Filter applications by status"
        style="width:auto; min-width:170px">

        <option value="all" ${statusFilter === "all" ? "selected" : ""}>
          All statuses
        </option>

        <option value="pending" ${statusFilter === "pending" ? "selected" : ""}>
          Pending
        </option>

        <option value="approved" ${statusFilter === "approved" ? "selected" : ""}>
          Approved
        </option>

        <option value="rejected" ${statusFilter === "rejected" ? "selected" : ""}>
          Rejected
        </option>
      </select>

      <button class="mum-button" type="button" id="refreshApplications">
        Refresh
      </button>
    </div>

    <p id="applicationCount">
      Showing ${filtered.length} of ${currentApplications.length} applications
    </p>

    <div id="applicationTable">
      ${renderRows(filtered)}
    </div>
  `;

  document.getElementById("applicationSearch")
    ?.addEventListener("input", event => {
      searchTerm = event.target.value;
      const cursorPosition = event.target.selectionStart;

      renderContent();

      const input = document.getElementById("applicationSearch");
      input?.focus();

      if (input && cursorPosition !== null) {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    });

  document.getElementById("applicationStatusFilter")
    ?.addEventListener("change", event => {
      statusFilter = event.target.value;
      renderContent();
    });

  document.getElementById("refreshApplications")
    ?.addEventListener("click", () => {
      void loadApplications();
    });

  currentContainer.querySelectorAll("[data-review]")
    .forEach(button => {
      button.addEventListener("click", () => {
        void reviewApplication(
          button.dataset.id,
          button.dataset.review,
          button
        );
      });
    });
}

async function loadApplications() {
  if (!currentContainer || loading) return;

  loading = true;
  const requestId = ++lastRequest;

  currentContainer.innerHTML = `
    <h2>Membership Applications</h2>
    ${loadingState("Loading applications…")}
  `;

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("membership_applications")
      .select(
        "id, user_id, full_name, contact_email, membership_id, application_status, submitted_at"
      )
      .order("submitted_at", { ascending: false });

    if (error) throw error;

    if (requestId !== lastRequest || !currentContainer) return;

    currentApplications = Array.isArray(data) ? data : [];
    renderContent();
  } catch (error) {
    console.error("Failed to load membership applications:", error);

    if (requestId === lastRequest && currentContainer) {
      currentContainer.innerHTML = `
        <h2>Membership Applications</h2>
        ${errorState(
          "Could not load applications. Check the Supabase connection and the current administrator's database permissions, then try Refresh."
        )}
        <button class="mum-button" type="button" id="retryApplications">
          Retry
        </button>
      `;

      document.getElementById("retryApplications")
        ?.addEventListener("click", () => {
          void loadApplications();
        });
    }
  } finally {
    loading = false;
  }
}

async function reviewApplication(applicationId, decision, button) {
  if (!applicationId || !["approved", "rejected"].includes(decision)) {
    showToast("Invalid application or review decision.", "error");
    return;
  }

  const application = currentApplications.find(
    item => String(item.id) === String(applicationId)
  );

  if (!application || applicationStatus(application) !== "pending") {
    showToast(
      "This application is no longer pending. Refresh the list before reviewing it.",
      "error"
    );
    return;
  }

  const applicantName = application.full_name || "this applicant";
  const actionLabel = decision === "approved" ? "approve" : "reject";

  const confirmed = window.confirm(
    `Are you sure you want to ${actionLabel} the application for ${applicantName}?`
  );

  if (!confirmed) return;

  const originalText = button?.textContent;

  if (button) {
    button.disabled = true;
    button.textContent = "Processing…";
  }

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase.rpc(
      "review_membership_application",
      {
        p_application_id: applicationId,
        p_decision: decision
      }
    );

    if (error) throw error;

    if (!data || data.success !== true || data.status !== decision) {
      throw new Error(
        "The database did not confirm the requested review decision."
      );
    }

    showToast(
      `Application ${decision} successfully.`,
      "success"
    );

    await loadApplications();
  } catch (error) {
    console.error("Application review failed:", error);

    showToast(
      error?.message ||
        "Unable to review the application. Refresh and try again.",
      "error"
    );

    if (button) {
      button.disabled = false;
      button.textContent = originalText || "Retry";
    }
  }
}

export async function renderMembershipSection(container) {
  currentContainer = container;
  searchTerm = "";
  statusFilter = "all";
  currentApplications = [];

  await loadApplications();
}

export function cleanupMembershipSection() {
  lastRequest++;
  currentContainer = null;
  currentApplications = [];
  loading = false;
}
