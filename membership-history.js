
/*
 * CheckmaîtréX Chess Club
 * Membership History — read-only admin view
 *
 * File: admin/membership-history.js
 *
 * Reads data only through:
 * public.admin_search_membership_history(...)
 *
 * Admin access is checked by the page controller and again by the RPC.
 */

import {
  getSupabaseClient,
  escapeHTML,
  formatDate
} from "./membership-shared.js";

const PAGE_SIZE = 100;

let activeController = null;
let activeContainer = null;
let activeStyle = null;

function formatDetails(value) {
  if (value === null || value === undefined) return "—";

  if (typeof value === "string") return value;

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function dateBoundary(value, nextDay = false) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);

  if (nextDay) {
    date.setDate(date.getDate() + 1);
  }

  return date.toISOString();
}

function renderStyles() {
  const style = document.createElement("style");
  style.dataset.membershipHistoryStyle = "true";
  style.textContent = `
    .mh-filters {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 14px;
      margin: 20px 0;
    }

    .mh-filters label {
      display: block;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .mh-filters input,
    .mh-filters select {
      box-sizing: border-box;
      width: 100%;
      min-height: 42px;
    }

    .mh-actions {
      display: flex;
      flex-wrap: wrap;
      align-items: end;
      gap: 8px;
    }

    .mh-table-wrap {
      overflow-x: auto;
      margin-top: 16px;
    }

    .mh-table {
      border-collapse: collapse;
      width: 100%;
      min-width: 700px;
    }

    .mh-table th,
    .mh-table td {
      text-align: left;
      vertical-align: top;
      padding: 10px;
      border-bottom: 1px solid rgba(180, 150, 70, .3);
      overflow-wrap: anywhere;
    }

    .mh-pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin: 18px 0;
    }

    .mh-detail {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(180, 150, 70, .4);
    }

    .mh-detail-grid {
      display: grid;
      grid-template-columns: minmax(130px, 190px) minmax(0, 1fr);
      gap: 10px;
      overflow-wrap: anywhere;
    }

    .mh-detail pre {
      margin: 0;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .mh-muted {
      opacity: .75;
    }

    @media (max-width: 480px) {
      .mh-detail-grid {
        grid-template-columns: 1fr;
        gap: 4px;
      }
    }
  `;

  document.head.appendChild(style);
  activeStyle = style;
}

function renderLayout(container) {
  container.innerHTML = `
    <header>
      <h2>Membership History</h2>
      <p>
        Review recorded membership events. This section is read-only.
      </p>
    </header>

    <section class="mum-card" style="margin-top: 20px;">
      <form id="mhFilters" class="mh-filters">
        <div>
          <label for="mhSearch">Search</label>
          <input
            id="mhSearch"
            name="search"
            type="search"
            placeholder="Name, Membership ID, event, ID, details…"
            autocomplete="off"
          >
        </div>

        <div>
          <label for="mhEventType">Exact event type (optional)</label>
          <input
            id="mhEventType"
            name="eventType"
            type="text"
            placeholder="e.g. membership_application_approved"
            autocomplete="off"
          >
        </div>

        <div>
          <label for="mhFrom">From date</label>
          <input id="mhFrom" name="fromDate" type="date">
        </div>

        <div>
          <label for="mhTo">To date</label>
          <input id="mhTo" name="toDate" type="date">
        </div>

        <div>
          <label for="mhSort">Sort order</label>
          <select id="mhSort" name="sortOrder">
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>

        <div class="mh-actions">
          <button type="submit">Search</button>
          <button type="button" id="mhReset">Reset</button>
        </div>
      </form>

      <p id="mhStatus" role="status" aria-live="polite">
        Loading membership history…
      </p>

      <div id="mhResults"></div>

      <nav
        id="mhPagination"
        class="mh-pagination"
        aria-label="Membership history pages"
        hidden
      >
        <button type="button" id="mhPrevious">Previous</button>
        <span id="mhPageLabel"></span>
        <button type="button" id="mhNext">Next</button>
      </nav>

      <section id="mhDetail" class="mh-detail" hidden>
        <h3>Event details</h3>
        <div id="mhDetailContent"></div>
        <button type="button" id="mhCloseDetail">Close details</button>
      </section>
    </section>
  `;
}

function readFilters(container) {
  const form = container.querySelector("#mhFilters");
  const values = new FormData(form);

  const fromDate = String(values.get("fromDate") || "");
  const toDate = String(values.get("toDate") || "");

  if (fromDate && toDate && fromDate > toDate) {
    throw new Error("The From date cannot be later than the To date.");
  }

  return {
    search: String(values.get("search") || "").trim() || null,
    eventType: String(values.get("eventType") || "").trim() || null,
    from: dateBoundary(fromDate),
    to: dateBoundary(toDate, true),
    sortOrder: values.get("sortOrder") === "asc" ? "asc" : "desc"
  };
}

async function queryHistory(filters, offset) {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase.rpc(
    "admin_search_membership_history",
    {
      p_search: filters.search,
      p_event_type: filters.eventType,
      p_from: filters.from,
      p_to: filters.to,
      p_sort_order: filters.sortOrder,
      p_page_size: PAGE_SIZE,
      p_offset: offset
    }
  );

  if (error) {
    throw new Error(error.message || "Unable to load membership history.");
  }

  if (
    !data ||
    !Array.isArray(data.items) ||
    !Number.isFinite(Number(data.total_count))
  ) {
    throw new Error(
      "Unexpected RPC response: expected total_count and items."
    );
  }

  return {
    totalCount: Number(data.total_count),
    items: data.items
  };
}

function renderRows(container, items) {
  const results = container.querySelector("#mhResults");

  if (!items.length) {
    results.innerHTML = `
      <p class="mh-muted">No matching history records were found.</p>
    `;
    return;
  }

  results.innerHTML = `
    <div class="mh-table-wrap">
      <table class="mh-table">
        <thead>
          <tr>
            <th>Date and time</th>
            <th>Event type</th>
            <th>Member</th>
            <th>Membership ID</th>
            <th>Actor / admin ID</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          ${items.map((item, index) => `
            <tr>
              <td>${escapeHTML(formatDate(item.created_at))}</td>
              <td>${escapeHTML(item.event_type)}</td>
              <td>${escapeHTML(item.full_name || item.user_id || "—")}</td>
              <td>${escapeHTML(item.membership_id || "—")}</td>
              <td>${escapeHTML(item.actor_user_id || "—")}</td>
              <td>
                <button type="button" data-mh-detail="${index}">
                  View
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderDetail(container, item) {
  const detail = container.querySelector("#mhDetail");
  const content = container.querySelector("#mhDetailContent");

  const fields = [
    ["History record ID", item.id],
    ["Date and time", formatDate(item.created_at)],
    ["Event type", item.event_type],
    ["Member name", item.full_name],
    ["Membership ID", item.membership_id],
    ["Member user ID", item.user_id],
    ["Actor / admin ID", item.actor_user_id],
    ["Details (JSON)", formatDetails(item.details)]
  ];

  content.innerHTML = `
    <div class="mh-detail-grid">
      ${fields.map(([label, value]) => `
        <strong>${escapeHTML(label)}</strong>
        <div>
          ${label === "Details (JSON)"
            ? `<pre>${escapeHTML(value)}</pre>`
            : escapeHTML(value || "—")}
        </div>
      `).join("")}
    </div>
  `;

  detail.hidden = false;
}

function updatePagination(container, totalCount, offset) {
  const nav = container.querySelector("#mhPagination");
  const previous = container.querySelector("#mhPrevious");
  const next = container.querySelector("#mhNext");
  const label = container.querySelector("#mhPageLabel");

  const page = Math.floor(offset / PAGE_SIZE) + 1;
  const pages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  nav.hidden = totalCount === 0;
  previous.disabled = offset <= 0;
  next.disabled = offset + PAGE_SIZE >= totalCount;
  label.textContent = `Page ${page} of ${pages} · ${totalCount} records`;
}

export async function renderMembershipSection(container) {
  cleanupMembershipSection();

  activeContainer = container;
  activeController = new AbortController();

  const { signal } = activeController;
  let offset = 0;
  let itemsOnPage = [];
  let requestId = 0;

  renderStyles();
  renderLayout(container);

  const results = container.querySelector("#mhResults");
  const status = container.querySelector("#mhStatus");
  const form = container.querySelector("#mhFilters");

  async function loadPage(reset = false) {
    const thisRequest = ++requestId;

    if (reset) offset = 0;

    let filters;

    try {
      filters = readFilters(container);
    } catch (error) {
      status.textContent = error.message;
      return;
    }

    status.textContent = "Loading membership history…";
    results.innerHTML = "";
    container.querySelector("#mhPagination").hidden = true;
    container.querySelector("#mhDetail").hidden = true;

    try {
      const response = await queryHistory(filters, offset);

      if (signal.aborted || thisRequest !== requestId) return;

      itemsOnPage = response.items;
      renderRows(container, itemsOnPage);
      updatePagination(container, response.totalCount, offset);

      if (response.totalCount === 0) {
        status.textContent = "No matching history records.";
      } else {
        const first = offset + 1;
        const last = Math.min(offset + itemsOnPage.length, response.totalCount);

        status.textContent =
          `Showing ${first}–${last} of ${response.totalCount} records.`;
      }
    } catch (error) {
      if (signal.aborted || thisRequest !== requestId) return;

      itemsOnPage = [];
      results.innerHTML = `
        <p class="mum-error" role="alert">
          ${escapeHTML(error.message || "Unable to load history.")}
        </p>
      `;
      status.textContent = "Could not load membership history.";
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    void loadPage(true);
  }, { signal });

  container.querySelector("#mhReset").addEventListener("click", () => {
    form.reset();
    void loadPage(true);
  }, { signal });

  container.querySelector("#mhPrevious").addEventListener("click", () => {
    if (offset >= PAGE_SIZE) {
      offset -= PAGE_SIZE;
      void loadPage();
    }
  }, { signal });

  container.querySelector("#mhNext").addEventListener("click", () => {
    offset += PAGE_SIZE;
    void loadPage();
  }, { signal });

  container.querySelector("#mhCloseDetail").addEventListener("click", () => {
    container.querySelector("#mhDetail").hidden = true;
  }, { signal });

  container.addEventListener("click", event => {
    const button = event.target.closest("[data-mh-detail]");

    if (!button || !container.contains(button)) return;

    const index = Number(button.dataset.mhDetail);

    if (Number.isInteger(index) && itemsOnPage[index]) {
      renderDetail(container, itemsOnPage[index]);
    }
  }, { signal });

  await loadPage(true);
}

export function cleanupMembershipSection() {
  if (activeController) {
    activeController.abort();
    activeController = null;
  }

  // Do not clear the shared panel here. The controller owns panel content.
  activeContainer = null;

  if (activeStyle) {
    activeStyle.remove();
    activeStyle = null;
  }
}
