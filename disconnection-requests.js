
/*
 * CheckmaitréX Chess Club
 * Membership Disconnection Requests
 *
 * File: admin/disconnection-requests.js
 *
 * Uses the secure Supabase RPC for admin review.
 * Membership changes and history logging are handled by the database.
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
        Review requests from members who want to disconnect
        from the club.
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
      .select(
        "id, user_id, reason, status, requested_at, reviewed_by, reviewed_at, review_note"
      )
      .order("requested_at", { ascending: false });

    if (error) throw error;

    if (!data || data.length === 0) {
      message.textContent = "No disconnection requests found.";
      list.innerHTML = "<p>No requests to display right now.</p>";
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

      const reviewedBy = request.reviewed_by
        ? escapeHTML(request.reviewed_by)
        : "Not reviewed";

      const actions = status === "pending"
        ? `
          <div class="disconnection-review-actions"
               style="margin-top: 16px;">
            <label for="review-note-${escapeHTML(request.id)}">
              Review note (optional)
            </label>

            <textarea
              id="review-note-${escapeHTML(request.id)}"
              data-review-note="${escapeHTML(request.id)}"
              rows="3"
              maxlength="2000"
              style="display:block;width:100%;margin:8px 0;"
              placeholder="Write a note for the member..."
            ></textarea>

            <button
              type="button"
              data-review-decision="approve"
              data-request-id="${escapeHTML(request.id)}"
            >
              Approve Disconnection
            </button>

            <button
              type="button"
              data-review-decision="reject"
              data-request-id="${escapeHTML(request.id)}"
              style="margin-left:8px;"
            >
              Reject Request
            </button>
          </div>
        `
        : `
          <p><em>This request has already been reviewed.</em></p>
        `;

      return `
        <article class="mum-card" style="margin-top:16px;">
          <div>
            <span class="mum-badge ${badgeClass}">
              ${escapeHTML(status)}
            </span>
          </div>

          <h3 style="margin-top:12px;">Disconnection Request</h3>

          <p><strong>Request ID:</strong> ${escapeHTML(request.id)}</p>
          <p><strong>Member User ID:</strong> ${escapeHTML(request.user_id)}</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p><strong>Requested:</strong> ${requestedAt}</p>
          <p><strong>Reviewed:</strong> ${reviewedAt}</p>
          <p><strong>Reviewed by:</strong> ${reviewedBy}</p>
          <p><strong>Review note:</strong> ${reviewNote}</p>

          ${actions}
        </article>
      `;
    }).join("");

    // Use one delegated listener for the current request list.
    list.addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-review-decision]");

      if (!button || !list.contains(button) || button.disabled) {
        return;
      }

      const requestId = button.dataset.requestId;
      const decision = button.dataset.reviewDecision;

      if (!requestId || !["approve", "reject"].includes(decision)) {
        showToast("Invalid review action.", "error");
        return;
      }

      const noteField = list.querySelector(
        `[data-review-note="${CSS.escape(requestId)}"]`
      );

      const reviewNote = noteField?.value.trim() || null;

      const actionLabel = decision === "approve"
        ? "approve this disconnection request"
        : "reject this disconnection request";

      if (!window.confirm(`Are you sure you want to ${actionLabel}?`)) {
        return;
      }

      const buttons = list.querySelectorAll(
        `button[data-request-id="${CSS.escape(requestId)}"]`
      );

      buttons.forEach((item) => {
        item.disabled = true;
      });

      message.textContent = `Processing request ${requestId}...`;

      try {
        const { data: result, error: rpcError } = await supabase.rpc(
          "review_membership_disconnection_request",
          {
            p_request_id: requestId,
            p_decision: decision,
            p_review_note: reviewNote
          }
        );

        if (rpcError) throw rpcError;

        if (!result || result.success !== true) {
          throw new Error("The database did not confirm the review.");
        }

        showToast(
          decision === "approve"
            ? "Disconnection approved. Membership status updated."
            : "Disconnection request rejected.",
          "success"
        );

        // Reload from the database to display the saved status.
        await renderMembershipSection(container);
      } catch (reviewError) {
        console.error("Failed to review disconnection request:", reviewError);

        showToast(
          reviewError?.message ||
            "Could not process the disconnection request.",
          "error"
        );

        message.textContent =
          "Review failed. The request list may be refreshed and tried again.";

        buttons.forEach((item) => {
          item.disabled = false;
        });
      }
    });

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
  // The review listener is attached to the rendered list element.
  // Re-rendering replaces that element and its listener.
}
