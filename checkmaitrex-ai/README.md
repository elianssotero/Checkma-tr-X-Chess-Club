# CheckmaîtréX AI

This repository directory contains the recovered and assembled modular project extracted from the `recovery-codes.html` and `recovery-codes(1).html` artifacts in the original project history.

This project is intentionally isolated under `/checkmaitrex-ai/` and does not modify the historical root-level files or production deployment configuration.

## Scope

- Modular Worker design for Cloudflare Workers.
- Gemini as the primary provider with Workers AI as the fallback path.
- Four assistant roles preserved: CheckmaîtréX AI, MaîtrAI, MaîtréX-AI, and CCC-AI.
- Recovery and integration manifest preserved in `RECOVERY_MANIFEST.md`.
- Local validation via Node-based syntax and test checks only.

## Quick start

```bash
cd checkmaitrex-ai
npm test
```

## Safety

- Never modify `main`.
- Never deploy or touch production credentials.
- Never alter root-level historical files.
- Keep all recovered source material in this development-only directory.
