export async function migrateConversations(kv, db) {
  const errors = [];
  const raw = kv ? await kv.get("conv_list").catch(() => null) : null;
  const sessionIds = raw ? JSON.parse(raw) : [];
  let migrated = 0;
  let skipped = 0;

  for (const sessionId of sessionIds) {
    try {
      const history = kv ? await kv.get(`conv:${sessionId}`).catch(() => null) : null;
      if (!history) {
        skipped += 1;
        continue;
      }
      const rows = JSON.parse(history);
      if (!Array.isArray(rows)) {
        skipped += 1;
        continue;
      }
      if (db) {
        await db.prepare("INSERT OR IGNORE INTO conversations (session_id, role, content) VALUES (?, ?, ?)")
          .bind(sessionId, rows[0]?.role || "user", rows[0]?.text || "")
          .run();
      }
      migrated += 1;
    } catch (error) {
      errors.push(error.message);
    }
  }

  return { migrated, skipped, errors };
}

export async function loadHistoryDual(sessionId, db, kv) {
  if (db) {
    try {
      const result = await db.prepare("SELECT role, content FROM conversations WHERE session_id = ? ORDER BY created_at ASC LIMIT 20").bind(sessionId).all();
      if (result.results?.length) return result.results.map((row) => ({ role: row.role, text: row.content }));
    } catch {
      // fall through
    }
  }

  if (kv) {
    try {
      const raw = await kv.get(`conv:${sessionId}`);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
  return [];
}
