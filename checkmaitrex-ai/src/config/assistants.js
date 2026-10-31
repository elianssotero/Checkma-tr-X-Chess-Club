export const ASSISTANT_CONFIG = {
  checkmaitrex: {
    id: "checkmaitrex",
    name: "CheckmaîtréX AI",
    description: "Chess intelligence and club operations assistant",
    preferredModel: "gemini-2.5-flash",
    preferredProvider: "gemini",
    capabilities: ["chat", "reasoning", "chess"],
    tier: 80,
  },
  maitrai: {
    id: "maitrai",
    name: "MaîtrAI",
    description: "Chess coaching and learning",
    preferredModel: "gemini-2.5-flash",
    preferredProvider: "gemini",
    capabilities: ["chat", "reasoning", "learning"],
    tier: 80,
  },
  maitrex: {
    id: "maitrex",
    name: "MaîtréX-AI",
    description: "General assistance",
    preferredModel: "gemini-2.5-flash",
    preferredProvider: "gemini",
    capabilities: ["chat", "general"],
    tier: 70,
  },
  ccc: {
    id: "ccc",
    name: "CCC-AI",
    description: "Chess Club assistance",
    preferredModel: "gemini-2.5-flash",
    preferredProvider: "gemini",
    capabilities: ["chat", "club"],
    tier: 70,
  },
};

export function getAssistantConfig(id) {
  return ASSISTANT_CONFIG[id] || ASSISTANT_CONFIG.checkmaitrex;
}
