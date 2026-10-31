# Architecture

## Project structure

- `src/index.js` — Worker entry point and request router.
- `src/config/` — assistant configuration and constants.
- `src/providers/` — Gemini and Workers AI adapters.
- `src/registry/` — model registry and routing metadata.
- `src/router/` — model selection logic.
- `src/orchestrator/` — orchestration flow.
- `src/assistants/` — assistant definitions and prompt wiring.
- `src/auth/` — auth, OAuth, RBAC, and owner checks.
- `src/handlers/` — chat, posts, auth, admin, misc endpoints.
- `src/services/` — chess, memory, health, usage, rate limiting, and knowledge modules.
- `src/durable-objects/` — rate limiter object.
- `src/utils/` — CORS, response, and validation helpers.
- `src/migrations/` — D1 schema.

## Request lifecycle

1. Parse request.
2. Apply CORS and validation.
3. Authenticate request if required.
4. Resolve assistant and model route.
5. Enforce rate limits and quotas.
6. Run provider fallback chain.
7. Return response and persist conversation metadata if permitted.

## Security model

- Secret values stay in env and Cloudflare secret storage.
- Owner-only administrative routes are server-side enforced.
- Provider fallback is explicit and non-destructive.
- No production database or secrets are executed or modified during this recovery branch.
