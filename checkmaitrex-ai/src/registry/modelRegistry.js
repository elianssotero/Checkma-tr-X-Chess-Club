export const PROVIDERS = {
  GEMINI: "gemini",
  WORKERSAI: "workersai",
};

export const MODEL_REGISTRY = [
  {
    id: "gemini-2.5-flash",
    provider: PROVIDERS.GEMINI,
    label: "Gemini 2.5 Flash",
    tier: 80,
    capabilities: ["chat", "stream", "vision", "structured", "reasoning"],
    maxInputTokens: 1048576,
    maxOutputTokens: 8192,
    paid: false,
    verified: true,
  },
  {
    id: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    provider: PROVIDERS.WORKERSAI,
    label: "Llama 3.3 70B (Workers AI)",
    tier: 70,
    capabilities: ["chat", "stream"],
    maxInputTokens: 128000,
    maxOutputTokens: 2048,
    paid: false,
    verified: false,
  },
];

export class ModelRegistry {
  constructor(models = MODEL_REGISTRY) {
    this.models = models;
    this.byId = new Map(models.map((m) => [m.id, m]));
  }

  get(id) {
    return this.byId.get(id);
  }

  list() {
    return this.models;
  }

  findByCapabilities(capabilities, providerFilter) {
    return this.models
      .filter((m) => {
        if (providerFilter && m.provider !== providerFilter) return false;
        return capabilities.every((cap) => m.capabilities.includes(cap));
      })
      .sort((a, b) => b.tier - a.tier);
  }

  fallbackChain(primaryId) {
    const primary = this.get(primaryId);
    if (!primary) return this.models.slice().sort((a, b) => b.tier - a.tier);
    const sameProvider = this.models
      .filter((m) => m.provider === primary.provider && m.id !== primary.id)
      .sort((a, b) => b.tier - a.tier);
    const otherProviders = this.models
      .filter((m) => m.provider !== primary.provider)
      .sort((a, b) => b.tier - a.tier);
    return [primary, ...sameProvider, ...otherProviders];
  }
}

export const registry = new ModelRegistry();
