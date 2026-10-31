# SOURCE DIFF REPORT

## Scope

This report is intentionally conservative. It documents only the source files and recovery excerpts that were actually visible in the available repository output.

It does not claim full recovery or full reconciliation of every source block from the two recovery transcripts.

## Working branch

- `phase8-recovery-integration`

## Safety status

- `main` was not modified.
- No merge to `main` was performed.
- No deployment was performed.
- No Cloudflare or production database settings were modified.
- Historical root files were not deleted or overwritten.

## Recovery source files inspected

- `recovery-codes.html`
- `recovery-codes(1).html`

## Known available branch files inspected

The following files were directly visible and readable in the available output and therefore constitute the only evidence-backed branch comparison set:

- `checkmaitrex-ai/src/index.js`
- `checkmaitrex-ai/src/config/constants.js`
- `checkmaitrex-ai/src/config/assistants.js`
- `checkmaitrex-ai/src/providers/base.js`
- `checkmaitrex-ai/src/providers/gemini.js`
- `checkmaitrex-ai/src/providers/workersai.js`
- `checkmaitrex-ai/src/registry/modelRegistry.js`
- `checkmaitrex-ai/src/router/modelRouter.js`
- `checkmaitrex-ai/src/services/chess.js`
- `checkmaitrex-ai/src/services/conversationMigration.js`
- `checkmaitrex-ai/src/services/health.js`
- `checkmaitrex-ai/src/utils/cors.js`
- `checkmaitrex-ai/src/utils/response.js`
- `checkmaitrex-ai/src/utils/validation.js`
- `checkmaitrex-ai/tests/core.test.js`
- `checkmaitrex-ai/tests/integration.test.js`

## Source-block inventory status

The recovery materials mention a large number of source blocks, including:

- `recovery-codes(1).html`: 26 FILE markers in the accessible recovery notes
- `recovery-codes.html`: 33 FILE markers mentioned in the recovery narrative

These inventories were not fully reconciled end-to-end in the current environment. The complete set of source blocks cannot be claimed as matched or verified without a full read of all file markers.

## Exact match findings

The following files were visible in both the recovery excerpts and the branch and appear to match their visible source snippets:

- `checkmaitrex-ai/src/index.js`
- `checkmaitrex-ai/src/config/constants.js`
- `checkmaitrex-ai/src/config/assistants.js`
- `checkmaitrex-ai/src/providers/base.js`
- `checkmaitrex-ai/src/providers/gemini.js`
- `checkmaitrex-ai/src/providers/workersai.js`
- `checkmaitrex-ai/src/registry/modelRegistry.js`
- `checkmaitrex-ai/src/router/modelRouter.js`
- `checkmaitrex-ai/src/services/chess.js`
- `checkmaitrex-ai/src/services/conversationMigration.js`
- `checkmaitrex-ai/src/services/health.js`
- `checkmaitrex-ai/src/utils/cors.js`
- `checkmaitrex-ai/src/utils/response.js`
- `checkmaitrex-ai/src/utils/validation.js`

Important caveat:

- These are only exact matches for the readable excerpts available in this session.
- They are not proof that the entire original source set was recovered.

## Modified file findings

The following files are not yet proven to be authoritative original source matches:

- `checkmaitrex-ai/src/index.js`
- `checkmaitrex-ai/src/services/chess.js`
- `checkmaitrex-ai/src/services/conversationMigration.js`
- `checkmaitrex-ai/src/services/health.js`

Reason:

- They may reflect a partial recovered or reconstructed implementation rather than the final original code.
- The full original source or authoritative alternative version was not fully readable in the available output.

## Incomplete or partial files

These are still incomplete or not proven complete:

- `checkmaitrex-ai/src/index.js` — minimal functional implementation, not proven to be the final full architecture
- `checkmaitrex-ai/src/services/chess.js` — visible minimal cloud-eval logic only
- `checkmaitrex-ai/src/services/conversationMigration.js` — visible partial migration helper only
- `checkmaitrex-ai/src/services/health.js` — visible status monitor only
- `checkmaitrex-ai/tests/core.test.js` — present but not full verification coverage
- `checkmaitrex-ai/tests/integration.test.js` — present but not full verification coverage

## Missing or unverified files

The following source paths were identified as recovery targets but were not fully read or verified in the accessible output:

- `checkmaitrex-ai/src/handlers/chat.js`
- `checkmaitrex-ai/src/handlers/posts.js`
- `checkmaitrex-ai/src/handlers/misc.js`
- `checkmaitrex-ai/src/handlers/auth.js`
- `checkmaitrex-ai/src/auth/auth.js`
- `checkmaitrex-ai/src/auth/oauth.js`
- `checkmaitrex-ai/src/auth/rbac.js`
- `checkmaitrex-ai/src/prompts/systemPrompts.js`
- `checkmaitrex-ai/src/durable-objects/RateLimiterDO.js`

Status: `UNVERIFIED / MISSING_OR_INCOMPLETE`

## Architecture conflicts

1. Monolithic source vs split modular source
   - Recovery discussion references monolithic files such as `checkmaitrex-ai-worker.js` and `part2.js` through `part5.js`.
   - The branch contains a split modular layout under `checkmaitrex-ai/src/`.
   - No authoritative final decision is justified from the current evidence.

2. Handler architecture
   - The current branch does not show the full handler set.
   - The earlier recovery notes mention multiple route handlers and a larger server architecture.
   - This is unresolved.

3. Authentication and authorization architecture
   - Auth files were named in the recovery notes but were not fully visible in the current tool output.
   - The current branch does not contain the full auth module set.

4. Migration and storage architecture
   - Migration references are present, but a complete authoritative migration inventory was not visible.

## Comparison results by category

### Exact matches
- Limited to directly visible excerpts and existing branch files.

### Modified files
- Not yet proven as changed from authoritative original source because the full original source is not fully visible.

### Incomplete files
- See the list above.

### Missing files
- See the unverified list above.

### Unavailable or uncertain source content
- The complete contents of both recovery transcripts were not fully available in the current tool output.
- Any deeper reconciliation would require a complete, bounded read of both files without truncation.

## Recommended authoritative source for conflicts

No authoritative source should be selected yet. The evidence at this stage is insufficient to merge competing implementations or declare one version authoritative.

Recommendation:

- Keep the existing branch state as the current working branch.
- Preserve the recovery source files as historical evidence.
- Do not merge architecture variants until complete block-by-block reads are available.

## Tests and validation status

Files present:

- `checkmaitrex-ai/tests/core.test.js`
- `checkmaitrex-ai/tests/integration.test.js`

Execution status:

- Full suite not executed in this pass.
- Pass/fail status not claimable.
- Reason: source recovery is incomplete and not fully authoritative.

## Commit status

Last known commit on this branch:

- `30bebd8e58f8b263ba93d80f734f8b5cdcf447bf`
- Message: `Correct the recovery manifest to remove unsupported completion claims and preserve only evidence-backed findings.`

This update is a report-only change and does not claim recovery completion.

## Final status

Status: `BLOCKED — ACCESS OR ENVIRONMENT LIMITATION`

Reason:

- The full contents of the recovery HTML files were not consistently readable in the current environment.
- The complete source-block inventory could not be reconciled end-to-end.
- The branch is not yet proven to contain the full authoritative recovered project.

## Next action

- Re-open `recovery-codes.html` and `recovery-codes(1).html` in smaller, bounded sections.
- Compare each source block to the branch one-by-one.
- Only after complete direct comparison should any file be marked as authoritative or complete.
