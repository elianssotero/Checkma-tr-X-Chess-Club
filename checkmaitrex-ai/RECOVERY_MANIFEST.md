# RECOVERY MANIFEST

## Purpose

This manifest records only evidence-backed recovery findings for the current branch. It does not claim the full project has been restored or that the recovered code is authoritative.

## Working branch

- `phase8-recovery-integration`

## Safety status

- `main` not modified
- No deployment performed
- No production Worker, database, migration, or secret changes performed
- Historical root recovery files preserved

## Verified recovery findings

### Transcript measurements

- `recovery-codes(1).html`: 91,537 characters
- `recovery-codes(1).html`: 26 FILE markers found
- `recovery-codes(1).html`: 26 readable fenced source blocks extracted
- `recovery-codes.html`: 207,374 characters
- `recovery-codes.html`: 33 FILE markers found
- `recovery-codes.html`: mixed transcript/source dump with inconsistent boundaries; not all 33 markers are proven complete verified source files

### Comparison status

- 26/26 readable source blocks extracted from `recovery-codes(1).html`
- 14 current branch files exist but are non-identical to the extracted blocks
- 0 exact text matches between extracted source blocks and branch files
- 12 source-available paths are missing from the branch but do have readable source blocks
- Recovery status: `INCOMPLETE / NOT VERIFIED`

## Existing files that are present but non-identical

Status: `EXISTS_BUT_UNRECONCILED`

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

These files are present on the branch, but they are not exact matches to the recovered source blocks and therefore are not treated as authoritative originals.

## Source-available but missing files

Status: `SOURCE_AVAILABLE_BUT_NOT_RESTORED`

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

These files were readable in the recovery transcript but were not restored in this task. They remain unimplemented in the branch.

## Comparison method and validation limits

Exact-text comparison was performed after normalizing line endings, trailing whitespace, and surrounding whitespace. This is not semantic verification and does not prove functional equivalence.

## Test execution status

- Tests were not executed in this audit.
- Status: `NOT_RUN`

## Final status

- Recovery status: `INCOMPLETE`
- Project completion: `NOT VERIFIED`
- Source restoration: `BLOCKED UNTIL FULL RECONCILIATION`
