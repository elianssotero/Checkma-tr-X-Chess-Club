# SOURCE DIFF REPORT

## Audit basis

This report reflects the independent GitHub audit findings for the recovery transcript material and the current branch state on `phase8-recovery-integration`.

### Recovery transcript measurements

- `recovery-codes(1).html`: 91,537 characters
- `recovery-codes(1).html`: 26 FILE markers found
- `recovery-codes(1).html`: 26 readable fenced source blocks extracted
- `recovery-codes.html`: 207,374 characters
- `recovery-codes.html`: 33 FILE markers found
- `recovery-codes.html`: mixed transcript / source dump with inconsistent code boundaries; not all 33 markers are proven complete verified source files

### Comparison method

Exact-text comparison was performed after normalizing line endings, trailing whitespace, and surrounding whitespace only. This is not semantic verification and does not prove the code is authoritative or functionally correct.

## Verified comparison results

- 26/26 readable fenced source blocks extracted from `recovery-codes(1).html`
- 14 current branch files exist but are non-identical to those extracted source blocks
- 0 exact text matches found between extracted source blocks and branch files
- 12 source-available paths are missing from the development branch but have readable source blocks in the recovery transcript
- Recovery status remains: `INCOMPLETE / NOT VERIFIED`

## 14 existing but non-identical files

These files exist in the development branch, but the recovered source content does not exactly match the extracted transcript block content.

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
- `checkmaitrex-ai/src/index.js`
- `checkmaitrex-ai/src/config/assistants.js`
- `checkmaitrex-ai/src/config/constants.js`

Status: `EXISTS_BUT_UNRECONCILED`

Do not treat either version as authoritative until full source verification is completed.

## 12 source-available but missing files

These files were present in the recovery transcript as readable source blocks but are not restored in the current branch.

- `checkmaitrex-ai/src/migrations/0001_initial.sql`
- `checkmaitrex-ai/src/services/knowledge.js`
- `checkmaitrex-ai/src/services/memory.js`
- `checkmaitrex-ai/src/services/monitoring.js`
- `checkmaitrex-ai/src/services/posts.js`
- `checkmaitrex-ai/src/services/rateLimit.js`
- `checkmaitrex-ai/src/services/usage.js`
- `checkmaitrex-ai/src/handlers/voice.js`
- `checkmaitrex-ai/src/handlers/chess-data.js`
- `checkmaitrex-ai/src/handlers/public.js`
- `checkmaitrex-ai/src/handlers/admin.js`
- `checkmaitrex-ai/src/orchestrator.js`

Status: `SOURCE_AVAILABLE_BUT_NOT_RESTORED`

No replacement code was created for these files in this audit task.

## Recovery transcript conflict

`recovery-codes.html` is a mixed transcript and source dump and contains 33 FILE markers. Because the boundaries are inconsistent, the 33 markers cannot be claimed as complete verified file recoveries. This transcript is useful as evidence, but it does not establish authoritative source completeness.

## Test execution status

Tests were not executed in this audit.

Status: `NOT_RUN`

## Current determination

- Recovery state: `INCOMPLETE`
- Project completion state: `NOT VERIFIED`
- Source restoration state: `BLOCKED UNTIL FULL RECONCILIATION`

## Safety status

- `main` was not modified.
- No merge to `main` was performed.
- No deployment occurred.
- No migration was run.
- No production Worker, database, or KV resource was modified.
- Historical root recovery files were preserved.
