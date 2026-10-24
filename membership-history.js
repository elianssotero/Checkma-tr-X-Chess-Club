
/*
 * CheckmaîtréX Chess Club
 * Membership History
 *
 * File: membership-history.js
 *
 * Safe placeholder until a verified audit/history table
 * and its access policies are available.
 *
 * This module performs no database reads or writes.
 */

export async function renderMembershipSection(container) {
  container.innerHTML = `
    <header>
      <h2>Membership History</h2>
      <p>
        Review past membership applications and administrative decisions
        once the audit history is configured.
      </p>
    </header>

    <section class="mum-card" style="margin-top: 20px;">
      <span class="mum-badge mum-badge-pending">
        Setup required
      </span>

      <h3>Membership history is not connected yet</h3>

      <p>
        The existing membership application records contain current
        application statuses, but a complete, verified audit history
        has not been configured for this page.
      </p>

      <h3>Recommended history details</h3>

      <ul>
        <li>Application or membership record reference</li>
        <li>Previous and new status</li>
        <li>Action performed, such as approval or rejection</li>
        <li>Administrator account responsible for the action</li>
        <li>Date and time of the action</li>
      </ul>

      <h3>Before enabling this feature</h3>

      <p>
        A database-backed audit log should record administrative decisions
        securely. Access should be restricted through verified database
        permissions, and ordinary members should not be able to modify
        audit records.
      </p>

      <p>
        No historical events are being displayed here because the source
        of those records has not yet been verified.
      </p>
    </section>
  `;
}

export function cleanupMembershipSection() {
  // No listeners or database operations to clean up.
}
