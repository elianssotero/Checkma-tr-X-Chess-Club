# Deployment guide

This document captures the safe operational steps for the recovered project without touching production resources.

## Developer-only checks

- run `npm test` in the project directory
- validate syntax with `node --check`
- confirm no secrets are embedded in the source tree

## Production guardrails

- never deploy from the `main` branch
- never run migrations against production D1
- never modify Cloudflare production settings or secrets
- keep this project in the isolated development branch only
