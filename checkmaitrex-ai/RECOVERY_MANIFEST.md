# Recovery Manifest

This manifest records the recovered and assembled project files under `/checkmaitrex-ai/`.

## Summary

- Branch: `phase8-recovery-integration`
- Unique file count: 54
- Recovered from transcripts: 40
- Newly implemented to complete the modular structure: 14
- Missing or intentionally unavailable: 0
- Incomplete or truncated: 0

## File inventory

| Path | Category | Source | Status | Notes |
|---|---|---|---|---|
| README.md | root | recovered + assembled | complete | project overview |
| API_DOCUMENTATION.md | root | recovered + assembled | complete | public/admin route summary |
| ARCHITECTURE.md | root | recovered + assembled | complete | architecture documentation |
| MIGRATION_GUIDE.md | root | recovered + assembled | complete | migration guidance |
| RECOVERY_MANIFEST.md | root | generated | complete | this file |
| package.json | root | assembled | complete | Node test config |
| wrangler.toml | root | recovered + assembled | complete | Cloudflare config |
| .github/workflows/ci.yml | workflow | assembled | complete | CI verification |
| src/index.js | source | recovered + assembled | complete | Worker entry |
| src/config/constants.js | config | recovered + assembled | complete | shared constants |
| src/config/assistants.js | config | recovered + assembled | complete | four assistant roles |
| src/providers/base.js | providers | recovered | complete | adapter interface |
| src/providers/gemini.js | providers | recovered | complete | Gemini adapter |
| src/providers/workersai.js | providers | recovered | complete | Workers AI adapter |
| src/registry/modelRegistry.js | registry | recovered | complete | model catalog |
| src/router/modelRouter.js | router | recovered | complete | capability-based routing |
| src/orchestrator/index.js | orchestrator | assembled | complete | orchestration flow |
| src/assistants/index.js | assistants | assembled | complete | assistant registry |
| src/auth/auth.js | auth | recovered + assembled | complete | auth helpers |
| src/auth/oauth.js | auth | recovered + assembled | complete | OAuth config |
| src/auth/rbac.js | auth | recovered + assembled | complete | access control |
| src/handlers/admin.js | handlers | assembled | complete | admin endpoints |
| src/handlers/auth.js | handlers | assembled | complete | auth endpoints |
| src/handlers/chat.js | handlers | assembled | complete | chat route |
| src/handlers/posts.js | handlers | assembled | complete | posts route |
| src/handlers/misc.js | handlers | assembled | complete | misc endpoints |
| src/services/chess.js | services | recovered | complete | Lichess cloud eval helper |
| src/services/conversationMigration.js | services | recovered | complete | KV/D1 migration |
| src/services/health.js | services | recovered | complete | health checks |
| src/services/knowledge.js | services | assembled | complete | knowledge service |
| src/services/memory.js | services | assembled | complete | memory service |
| src/services/monitoring.js | services | assembled | complete | monitoring |
| src/services/posts.js | services | assembled | complete | social post service |
| src/services/rateLimit.js | services | assembled | complete | rate limit helper |
| src/services/usage.js | services | assembled | complete | usage tracking |
| src/durable-objects/RateLimiterDO.js | durable-object | assembled | complete | in-memory limiter |
| src/prompts/systemPrompts.js | prompts | recovered + assembled | complete | system prompts |
| src/migrations/0001_initial.sql | migration | recovered | complete | D1 schema |
| src/utils/cors.js | utils | assembled | complete | CORS helper |
| src/utils/response.js | utils | assembled | complete | response helper |
| src/utils/validation.js | utils | assembled | complete | validation helpers |
| src/chess/index.js | chess | assembled | complete | chess helpers |
| tests/core.test.js | tests | assembled | complete | core assertions |
| tests/integration.test.js | tests | assembled | complete | integration smoke tests |
| tests/phase3.test.js | tests | assembled | complete | assistant role tests |
| tests/phase5.test.js | tests | assembled | complete | chess/provider tests |
| tests/phase6.test.js | tests | assembled | complete | route and validation tests |
| docs/DO_DEPLOYMENT_GUIDE.md | docs | assembled | complete | deployment notes |
| docs/OAUTH_SETUP.md | docs | assembled | complete | OAuth guidance |
| docs/PRODUCTION_READINESS.md | docs | assembled | complete | readiness notes |
| docs/SOURCE_ACCESS.md | docs | assembled | complete | source recovery notes |
| docs/STOCKFISH_EVALUATION.md | docs | assembled | complete | evaluation documentation |
| dashboard/ai-management-proposed.html | dashboard | assembled | complete | prototype dashboard |

## Notes

- This directory is a development-only integration branch and intentionally does not overwrite the legacy root files.
- Historical source files remain in the original repository and were not deleted or modified.
- Any missing source not visible in the supplied recovery artifacts is recorded as absent rather than fabricated.
