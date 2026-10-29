
import {
  getSupabaseClient,
  escapeHTML,
  formatDate,
  statusBadge,
  loadingState,
  errorState
} from "./membership-shared.js";

let searchHandler = null;
let searchTimer = null;
let currentContainer = null;

export async function renderMembershipSection(container) {
  cleanupMembershipSection();

  currentContainer = container;

  container.innerHTML = `
    <header>
      <h2>Member Directory</h2>
      <p>
        Search and view membership profiles. This section does not edit
        or delete member records.
      </p>
    </header>

    <section class="mum-card" style="margin-top: 20px;">
      <label for="memberDirectorySearch">
        Search members
      </label>

      <input
        id="memberDirectorySearch"
        class="mum-input"
        type="search"
        placeholder="Search by name, Membership ID, or status"
        autocomplete="off"
      />

      <p id="memberDirectoryCount" aria-live="polite">
        Loading member records…
      </p>

      <div id="memberDirectoryResults">
        ${loadingState("Loading member directory…")}
      </div>
    </section>
  `;

  const searchInput = container.querySelector("#memberDirectorySearch");

  searchHandler = () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      loadMembers(container, searchInput.value);
    }, 200);
  };

  searchInput.addEventListener("input", searchHandler);

  await loadMembers(container, "");
}

async function loadMembers(container, searchTerm) {
  const results = container.querySelector("#memberDirectoryResults");
  const count = container.querySelector("#memberDirectoryCount");

  if (!results || !count) return;

  results.innerHTML = loadingState("Loading member records…");
  count.textContent = "Loading member records…";

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("member_profiles")
      .select(
        "user_id, full_name, membership_id, membership_status, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    const members = Array.isArray(data) ? data : [];
    const query = searchTerm.trim().toLowerCase();

    const filteredMembers = members.filter((member) => {
      const searchableText = [
        member.full_name,
        member.membership_id,
        member.membership_status
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });

    count.textContent =
      `${filteredMembers.length} of ${members.length} member profiles`;

    if (filteredMembers.length === 0) {
      results.innerHTML = `
        <p class="mum-empty">
          No matching member profiles were found.
        </p>
      `;
      return;
    }

    results.innerHTML = `
      <div class="mum-table-wrap">
        <table class="mum-table">
          <thead>
            <tr>
              <th scope="col">Member name</th>
              <th scope="col">Membership ID</th>
              <th scope="col">Status</th>
              <th scope="col">Record created</th>
            </tr>
          </thead>

          <tbody>
            ${filteredMembers
              .map(
                (member) => `
                  <tr>
                    <td>
                      ${escapeHTML(member.full_name || "Unnamed member")}
                    </td>

                    <td>
                      ${escapeHTML(member.membership_id || "Not assigned")}
                    </td>

                    <td>
                      ${statusBadge(member.membership_status)}
                    </td>

                    <td>
                      ${escapeHTML(formatDate(member.created_at))}
                    </td>
                  </tr>
                `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;
  } catch (error) {
    console.error("Unable to load member directory:", error);

    count.textContent = "Unable to load member records.";

    results.innerHTML = errorState(
      "The member directory could not be loaded. Check the Supabase connection and administrator read permissions, then try again."
    );
  }
}

export function cleanupMembershipSection() {
  clearTimeout(searchTimer);
  searchTimer = null;

  if (currentContainer && searchHandler) {
    const input = currentContainer.querySelector("#memberDirectorySearch");

    if (input) {
      input.removeEventListener("input", searchHandler);
    }
  }

  searchHandler = null;
  currentContainer = null;
}
