
/*
 * CheckmaîtréX Chess Club
 * Approved Members
 *
 * File: approved-members.js
 * Location: repository root
 *
 * Read-only view of approved member profiles.
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
let members = [];
let searchQuery = "";
let loading = false;
let requestId = 0;

function isApproved(member) {
  return String(member.membership_status ?? "")
    .trim()
    .toLowerCase() === "approved";
}

function matchesSearch(member) {
  const query = searchQuery.trim().toLowerCase();

  if (!query) return true;

  return [
    member.full_name,
    member.membership_id,
    member.membership_status
  ].some(value =>
    String(value ?? "").toLowerCase().includes(query)
  );
}

function renderRows(list) {
  if (!list.length) {
    return emptyState("No approved members match your search.");
  }

  return `
    <div class="mum-table-wrap">
      <table class="mum-table">
        <thead>
          <tr>
            <th scope="col">Member</th>
            <th scope="col">Membership ID</th>
            <th scope="col">Status</th>
            <th scope="col">Record Created</th>
          </tr>
        </thead>

        <tbody>
          ${list.map(member => `
            <tr>
              <td>
                <strong>
                  ${escapeHTML(member.full_name || "Unnamed member")}
                </strong>
              </td>

              <td>
                ${escapeHTML(member.membership_id || "—")}
              </td>

              <td>
                ${statusBadge(member.membership_status)}
              </td>

              <td>
                ${escapeHTML(formatDate(member.created_at))}
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

  const filtered = members.filter(matchesSearch);

  containerRef.innerHTML = `
    <header>
      <h2>Approved Members</h2>
      <p>
        View membership profiles whose current membership status is approved.
      </p>
    </header>

    <div class="mum-toolbar">
      <input
        class="mum-search"
        id="approvedMemberSearch"
        type="search"
        placeholder="Search member name or Membership ID…"
        aria-label="Search approved members"
        value="${escapeHTML(searchQuery)}">

      <button
        class="mum-button"
        id="refreshApprovedMembers"
        type="button">
        Refresh
      </button>
    </div>

    <p>
      Showing ${filtered.length} of ${members.length} approved members.
    </p>

    <div id="approvedMemberTable">
      ${renderRows(filtered)}
    </div>
  `;

  document.getElementById("approvedMemberSearch")
    ?.addEventListener("input", event => {
      searchQuery = event.target.value;
      const position = event.target.selectionStart;

      render();

      const input = document.getElementById("approvedMemberSearch");
      input?.focus();

      if (input && position !== null) {
        input.setSelectionRange(position, position);
      }
    });

  document.getElementById("refreshApprovedMembers")
    ?.addEventListener("click", () => {
      void loadApprovedMembers();
    });
}

async function loadApprovedMembers() {
  if (!containerRef || loading) return;

  loading = true;
  const currentRequest = ++requestId;

  containerRef.innerHTML = `
    <h2>Approved Members</h2>
    ${loadingState("Loading approved members…")}
  `;

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("member_profiles")
      .select(
        "user_id, full_name, membership_id, membership_status, created_at"
      )
      .eq("membership_status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (currentRequest !== requestId || !containerRef) return;

    members = Array.isArray(data) ? data : [];
    render();
  } catch (error) {
    console.error("Failed to load approved members:", error);

    if (currentRequest === requestId && containerRef) {
      containerRef.innerHTML = `
        <h2>Approved Members</h2>

        ${errorState(
          "Unable to load approved members. Check the Supabase connection, table columns, and administrator read permissions."
        )}

        <button
          class="mum-button"
          id="retryApprovedMembers"
          type="button">
          Retry
        </button>
      `;

      document.getElementById("retryApprovedMembers")
        ?.addEventListener("click", () => {
          void loadApprovedMembers();
        });
    }
  } finally {
    loading = false;
  }
}

export async function renderMembershipSection(container) {
  containerRef = container;
  members = [];
  searchQuery = "";

  await loadApprovedMembers();
}

export function cleanupMembershipSection() {
  requestId++;
  containerRef = null;
  members = [];
  loading = false;
}
