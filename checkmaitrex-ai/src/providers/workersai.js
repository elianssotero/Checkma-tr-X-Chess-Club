import { BaseProvider } from "./base.js";

export class WorkersAIProvider extends BaseProvider {
  constructor() {
    super("workersai");
  }

  _binding(env) {
    if (!env?.AI) throw new Error("Workers AI binding (AI) is not configured");
    return env.AI;
  }

  _toMessages(params) {
    const msgs = [];
    if (params.systemInstruction) {
      msgs.push({ role: "system", content: params.systemInstruction });
    }

    for (const turn of params.contents || []) {
      const text = (turn.parts || []).map((p) => p.text || "").join("");
      msgs.push({ role: turn.role === "model" ? "assistant" : "user", content: text });
    }
    return msgs;
  }

  async generate(params, env) {
    const ai = this._binding(env);
    const messages = this._toMessages(params);
    const input = { messages };
    if (params.generationConfig?.maxOutputTokens) {
      input.max_tokens = params.generationConfig.maxOutputTokens;
    }
    if (params.generationConfig?.temperature != null) {
      input.temperature = params.generationConfig.temperature;
    }
    const res = await ai.run(params.modelId, input);
    return { text: res?.response || res?.result?.response || "", usage: res?.usage || null, raw: res };
  }

  async *stream(params, env) {
    const ai = this._binding(env);
    const messages = this._toMessages(params);
    const input = { messages, stream: true };
    if (params.generationConfig?.maxOutputTokens) {
      input.max_tokens = params.generationConfig.maxOutputTokens;
    }
    const res = await ai.run(params.modelId, input);
    if (res && typeof res[Symbol.asyncIterator] === "function") {
      let usage = null;
      for await (const chunk of res) {
        const text = chunk?.response || chunk?.delta?.content || "";
        if (text) yield { type: "text", text };
        if (chunk?.usage) usage = chunk.usage;
      }
      if (usage) yield { type: "usage", usage };
      return;
    }
    const text = res?.response || "";
    if (text) yield { type: "text", text };
    if (res?.usage) yield { type: "usage", usage: res.usage };
  }

  async healthCheck(env) {
    return { ok: !!env?.AI };
  }
}
