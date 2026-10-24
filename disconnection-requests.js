
/*
 * CheckmaitréX Chess Club
 * Membership Disconnection Requests
 *
 * File: admin/disconnection-requests.js
 *
 * Read-only request list.
 * Approval/rejection will be enabled after secure review RPCs
 * and membership-history logging are implemented.
 */

import {
  getSupabaseClient,
  escapeHTML,
  formatDate,
  showToast
} from "./membership-shared.js";

export async function renderMembershipSection(container) {
  container.innerHTML = `
    <header>
      <h2>Membership Disconnection Requests</h2>
      <p>
        Review requests from members who want to leave or disconnect
        from the club. This page is currently read-only.
      </p>
    </header>

    <section class="mum-card" style="margin-top: 20px;">
      <p id="disconnectionRequestsMessage" role="status">
        Loading requests...
      </p>
      <div id="disconnectionRequestsList"></div>
    </section>
  `;

  const message = container.querySelector("#disconnectionRequestsMessage");
  const list = container.querySelector("#disconnectionRequestsList");

  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from("membership_disconnection_requests")
      .select("id, user_id, reason, status, requested_at, reviewed_at, review_note")
      .order("requested_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      message.textContent = "No disconnection requests found.";
      list.innerHTML = `
        <p>No requests to display right now.</p>
      `;
      return;
    }

    message.textContent = `${data.length} request(s) found.`;

    list.innerHTML = data.map((request) => {
      const status = String(request.status || "unknown").toLowerCase();

      const badgeClass = {
        pending: "mum-badge-pending",
        approved: "mum-badge-approved",
        rejected: "mum-badge-rejected"
      }[status] || "";

      const reason = request.reason
        ? escapeHTML(request.reason)
        : "No reason provided.";

      const reviewNote = request.review_note
        ? escapeHTML(request.review_note)
        : "No review note.";

      const requestedAt = request.requested_at
        ? escapeHTML(formatDate(request.requested_at))
        : "Not available";

      const reviewedAt = request.reviewed_at
        ? escapeHTML(formatDate(request.reviewed_at))
        : "Not reviewed";

      return `
        <article class="mum-card" style="margin-top: 16px;">
          <div>
            <span class="mum-badge ${badgeClass}">
              ${escapeHTML(status)}
            </span>
          </div>

          <h3 style="margin-top: 12px;">Disconnection Request</h3>

          <p>
            <strong>Request ID:</strong>
            ${escapeHTML(request.id)}
          </p>

          <p>
            <strong>Member User ID:</strong>
            ${escapeHTML(request.user_id)}
          </p>

          <p>
            <strong>Reason:</strong> ${reason}
          </p>

          <p>
            <strong>Requested:</strong> ${requestedAt}
          </p>

          <p>
            <strong>Reviewed:</strong> ${reviewedAt}
          </p>

          <p>
            <strong>Review note:</strong> ${reviewNote}
          </p>

          ${
            status === "pending"
              ? `<p>
                   <em>
                     Review actions are not enabled yet. No membership
                     records have been changed.
                   </em>
                 </p>`
              : ""
          }
        </article>
      `;
    }).join("");

  } catch (error) {
    console.error("Failed to load disconnection requests:", error);

    message.textContent = "Unable to load disconnection requests.";
    list.innerHTML = `
      <p>
        Check your connection, administrator access, and Supabase RLS
        policies, then reload this section.
      </p>
    `;

    showToast(
      error?.message || "Could not load disconnection requests.",
      "error"
    );
  }
}

export function cleanupMembershipSection() {
  // No event listeners or background operations are created.
}
