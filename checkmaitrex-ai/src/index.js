import { DEFAULT_ASSISTANT } from "../config/constants.js";
import { getAssistantConfig } from "../config/assistants.js";
import { validateChatInput } from "../utils/validation.js";
import { jsonResponse, errorResponse } from "../utils/response.js";
import { handleCors } from "../utils/cors.js";

export async function handleChatRequest(request, env = {}) {
  const corsResult = handleCors(request);
  if (corsResult) return corsResult;

  const body = await request.json().catch(() => ({}));
  const errors = validateChatInput(body);
  if (errors.length) {
    return errorResponse(errors[0], 400);
  }

  const assistantId = body.assistant || DEFAULT_ASSISTANT;
  const assistant = getAssistantConfig(assistantId);
  return jsonResponse({
    ok: true,
    assistant: assistant.name,
    message: body.message || body.text,
    model: assistant.preferredModel,
    requestId: "req_demo",
  }, 200, {
    "x-checkmaitrex-assistant": assistant.id,
  });
}

export default {
  handleChatRequest,
};
