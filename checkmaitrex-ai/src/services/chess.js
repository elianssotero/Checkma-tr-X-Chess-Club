import { DEFAULT_ASSISTANT } from "./config/constants.js";

export async function getCloudEval(fen) {
  if (!fen || typeof fen !== "string") return null;
  try {
    const url = `https://lichess.org/api/cloud-eval?fen=${encodeURIComponent(fen)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.pvs || !Array.isArray(data.pvs)) return null;
    return {
      depth: data.depth || 0,
      knodes: data.knodes || 0,
      fen: data.fen || fen,
      pvs: data.pvs.map((pv) => ({ moves: pv.moves || "", cp: pv.cp ?? null, mate: pv.mate ?? null })),
    };
  } catch {
    return null;
  }
}

export function extractFen(message) {
  if (!message || typeof message !== "string") return null;
  const match = message.match(/([rnbqkpRNBQKP1-8]+\/){7}[rnbqkpRNBQKP1-8]+\s+[wb]\s+([KQkqA-Ha-h-]+|{-})\s+(-|[a-h3-8])\s+(\d+)\s+(\d+)/);
  return match ? match[0] : null;
}

export function getDefaultAssistant() {
  return DEFAULT_ASSISTANT;
}
