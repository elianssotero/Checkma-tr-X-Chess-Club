import { registry, PROVIDERS } from "../registry/modelRegistry.js";

export class ModelRouter {
  constructor() {
    this.healthCache = new Map();
    this.healthTTL = 60000;
  }

  async route({ assistantConfig, capabilities = ["chat"], allowPaid = false }) {
    const preferred = assistantConfig?.preferredModel ? registry.get(assistantConfig.preferredModel) : null;
    let chain;

    if (preferred) {
      chain = registry.fallbackChain(preferred.id);
    } else {
      chain = [
        ...registry.findByCapabilities(capabilities, PROVIDERS.GEMINI),
        ...registry.findByCapabilities(capabilities, PROVIDERS.WORKERSAI),
      ];
    }

    if (!allowPaid) {
      chain = chain.filter((m) => !m.paid);
    }

    chain = chain.filter((m) => capabilities.every((cap) => m.capabilities.includes(cap)));
    const seen = new Set();
    chain = chain.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    if (!chain.length) {
      throw new Error("No model available for the requested capabilities");
    }

    return { chain, primary: chain[0] };
  }

  markUnhealthy(modelId) {
    this.healthCache.set(modelId, { ok: false, ts: Date.now() });
  }

  isHealthy(modelId) {
    const entry = this.healthCache.get(modelId);
    if (!entry) return true;
    if (Date.now() - entry.ts > this.healthTTL) {
      this.healthCache.delete(modelId);
      return true;
    }
    return entry.ok;
  }

  healthyChain(chain) {
    return chain.filter((model) => this.isHealthy(model.id));
  }
}

export const router = new ModelRouter();
