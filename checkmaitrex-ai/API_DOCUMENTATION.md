# API Documentation

Base URL: `https://checkmaitrex-ai.elianssotero11.workers.dev`

## Public endpoints

- `GET /health`
- `GET /api/assistants`
- `GET /api/posts`
- `GET /api/members`
- `GET /api/tournaments`
- `GET /api/lessons`

## Chat endpoints

- `POST /api/chat`
- `POST /api/chat/stream`
- `POST /` (legacy preserved route)
- `POST /stream` (legacy preserved route)

## Authenticated routes

- `GET /api/auth/me`
- `GET /api/conversations`
- `GET /api/memory`
- `POST /api/memory`
- `POST /api/chess/analyze`
- `POST /api/chess/review`

## Admin routes

- `GET /api/admin/ai/models`
- `POST /api/admin/migrate`
- `GET /api/admin/assistants`
- `GET /api/admin/health`
- `GET /api/admin/usage`
- `GET /api/admin/audit`

All admin and owner-only routes must validate server-side tokens and role checks. The frontend must never be relied upon for authorization enforcement.
