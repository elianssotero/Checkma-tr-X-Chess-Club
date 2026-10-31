# Stockfish evaluation

The recovered source indicates Lichess cloud evaluation is used when available. The project does not represent a Worker-local Stockfish runtime as a verified implementation.

This is important:

- Cloudflare Workers runtime constraints make a local Stockfish process unsupported by default.
- Evaluation should be treated as external or best-effort unless a verified deployment exists.
- The safe behavior is to return unavailable when a chess evaluation backend is not configured.
