import { registry } from "../registry/modelRegistry.js";

export async function systemHealthCheck(env) {
  const results = {
    gemini: { ok: !!env?.GEMINI_API_KEY },
    workersAI: { ok: !!env?.AI },
    d1: { ok: !!env?.DB },
    kv: { ok: !!env?.SOCIAL_DATA },
    rateLimiter: { ok: true },
  };

  return {
    status: Object.values(results).every((result) => result.ok) ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    checks: results,
    models: {
      total: registry.list().length,
      verified: registry.list().filter((m) => m.verified).length,
    },
  };
}
