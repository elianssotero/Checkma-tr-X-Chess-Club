import { BaseProvider } from "./base.js";
import {
  GEMINI_ENDPOINT_BASE,
  AI_TIMEOUT_MS,
  AI_STREAM_TIMEOUT_MS,
  MAX_OUTPUT_TOKENS,
} from "../config/constants.js";

export class GeminiProvider extends BaseProvider {
  constructor() {
    super("gemini");
  }

  _apiKey(env) {
    const key = env?.GEMINI_API_KEY;
    if (!key) throw new Error("GEMINI_API_KEY secret is not set");
    return key;
  }

  _model(params, env) {
    return env?.GEMINI_MODEL || params.modelId;
  }

  _buildBody(params) {
    const body = {
      contents: params.contents,
      generationConfig: {
        maxOutputTokens: params.generationConfig?.maxOutputTokens || MAX_OUTPUT_TOKENS,
        temperature: params.generationConfig?.temperature ?? 0.7,
      },
    };

    if (params.systemInstruction) {
      body.systemInstruction = { parts: [{ text: params.systemInstruction }] };
    }

    return body;
  }

  async generate(params, env, signal) {
    const apiKey = this._apiKey(env);
    const model = this._model(params, env);
    const url = `${GEMINI_ENDPOINT_BASE}${model}:generateContent?key=${apiKey}`;
    const body = this._buildBody(params);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: signal || controller.signal,
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") || "";
      return { text, usage: data?.usageMetadata || null, raw: data };
    } finally {
      clearTimeout(timeout);
    }
  }

  async *stream(params, env, signal) {
    const apiKey = this._apiKey(env);
    const model = this._model(params, env);
    const url = `${GEMINI_ENDPOINT_BASE}${model}:streamGenerateContent?key=${apiKey}&alt=sse`;
    const body = this._buildBody(params);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), AI_STREAM_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: signal || controller.signal,
      });
      if (!res.ok || !res.body) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Gemini stream HTTP ${res.status}: ${txt.slice(0, 200)}`);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let usage = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;
          const payload = trimmed.slice(5).trim();
          if (!payload) continue;
          try {
            const chunk = JSON.parse(payload);
            const parts = chunk?.candidates?.[0]?.content?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.text) yield { type: "text", text: part.text };
              }
            }
            if (chunk?.usageMetadata) usage = chunk.usageMetadata;
          } catch {
            // ignore malformed stream fragments
          }
        }
      }
      if (usage) yield { type: "usage", usage };
    } finally {
      clearTimeout(timeout);
    }
  }

  async healthCheck(env) {
    return { ok: !!env?.GEMINI_API_KEY };
  }
}
