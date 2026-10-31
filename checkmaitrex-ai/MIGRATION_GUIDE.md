# Migration Guide

This project keeps all historical recovery artifacts and source material in the original repository. The new project under `/checkmaitrex-ai/` is a development-only modular implementation intended to preserve and organize the recovery output.

## Local development

```bash
cd checkmaitrex-ai
npm install
npm test
```

## D1 schema

The included migration file is:

- `src/migrations/0001_initial.sql`

This migration is additive and should only be executed in a development database. It must not be applied to production without explicit owner approval.

## Safety rules

- Do not touch `main`.
- Do not run migrations in production.
- Do not deploy.
- Do not expose secrets or credentials.
