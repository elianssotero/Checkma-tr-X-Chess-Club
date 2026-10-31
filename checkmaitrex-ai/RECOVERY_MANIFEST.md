# Recovery Manifest

This manifest is an interim record and was not intended to claim full project completion. It reflects only files that were directly inspected or referenced in the available recovery output, and it preserves the history of prior notes without claiming a complete recovery.

## Current status

- Working branch: `phase8-recovery-integration`
- Recovery status: `INCOMPLETE`
- Evidence level: `PARTIAL`
- Final completion claim: `NOT VERIFIED`
- Safety: `main` untouched; no production deployment or production resource changes performed

## Summary

- Branch: `phase8-recovery-integration`
- Directly inspected files on branch: 16 (subset only)
- Files reported in recovery notes but not fully reconciled: 26+ source blocks
- Files explicitly unverified or missing: 9 investigation targets recorded below
- Duplicate/version resolution: not finalized
- Completion claim: not supported by full transcript evidence

## Evidence-backed file inventory

| Path | Category | Status | Notes |
|---|---|---|---|
| `checkmaitrex-ai/README.md` | root | partially verified | present on branch; not a full source recovery |
| `checkmaitrex-ai/API_DOCUMENTATION.md` | root | partially verified | present on branch; docs not reconciled against full source |
| `checkmaitrex-ai/ARCHITECTURE.md` | root | partially verified | present on branch; not source-verified |
| `checkmaitrex-ai/MIGRATION_GUIDE.md` | root | partially verified | present on branch; not source-verified |
| `checkmaitrex-ai/package.json` | root | partially verified | present on branch; config not fully validated |
| `checkmaitrex-ai/wrangler.toml` | root | partially verified | present on branch; config is not deployment-verified |
| `checkmaitrex-ai/src/index.js` | source | directly inspected | readable and present |
| `checkmaitrex-ai/src/config/constants.js` | config | directly inspected | readable and present |
| `checkmaitrex-ai/src/config/assistants.js` | config | directly inspected | readable and present |
| `checkmaitrex-ai/src/providers/base.js` | provider | directly inspected | readable and present |
| `checkmaitrex-ai/src/providers/gemini.js` | provider | directly inspected | readable and present |
| `checkmaitrex-ai/src/providers/workersai.js` | provider | directly inspected | readable and present |
| `checkmaitrex-ai/src/registry/modelRegistry.js` | registry | directly inspected | readable and present |
| `checkmaitrex-ai/src/router/modelRouter.js` | router | directly inspected | readable and present |
| `checkmaitrex-ai/src/services/chess.js` | service | directly inspected | readable and present |
| `checkmaitrex-ai/src/services/conversationMigration.js` | service | directly inspected | readable and present |
| `checkmaitrex-ai/src/services/health.js` | service | directly inspected | readable and present |
| `checkmaitrex-ai/src/utils/cors.js` | util | directly inspected | readable and present |
| `checkmaitrex-ai/src/utils/response.js` | util | directly inspected | readable and present |
| `checkmaitrex-ai/src/utils/validation.js` | util | directly inspected | readable and present |
| `checkmaitrex-ai/tests/core.test.js` | test | directly inspected | present |
| `checkmaitrex-ai/tests/integration.test.js` | test | directly inspected | present |

## Investigation targets not conclusively verified

The following paths are cited in the recovery discussion but remain unverified in the current accessible output:

- `checkmaitrex-ai/src/handlers/chat.js`
- `checkmaitrex-ai/src/handlers/posts.js`
- `checkmaitrex-ai/src/handlers/misc.js`
- `checkmaitrex-ai/src/handlers/auth.js`
- `checkmaitrex-ai/src/auth/auth.js`
- `checkmaitrex-ai/src/auth/oauth.js`
- `checkmaitrex-ai/src/auth/rbac.js`
- `checkmaitrex-ai/src/prompts/systemPrompts.js`
- `checkmaitrex-ai/src/durable-objects/RateLimiterDO.js`

These are not marked as complete or recovered. Their status remains: `UNVERIFIED / MISSING OR INCOMPLETE`.

## Source-block reconciliation status

The recovery files mention multiple source blocks and file inventories, including:

- `recovery-codes(1).html` with a 26-block inventory
- `recovery-codes.html` with a separate 33-block inventory

These were not fully reconciled in the current tool output. Until that is done, no final count or final completion claim is supported.

## Architecture note

The current branch contains a split modular structure under `checkmaitrex-ai/src/`, while the earlier monolithic recovery notes reference `checkmaitrex-ai-worker.js` and `part2.js` through `part5.js`. This is a real unresolved architecture conflict and remains unresolved.

## Final manifest status

This manifest should be treated as an interim evidence record, not as proof of a complete project recovery.

- Verified direct file reads: subset only
- Final full recovery status: not proven
- Final project completion status: not proven
- Final project readiness: not proven
