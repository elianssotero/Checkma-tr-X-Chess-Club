import { MAX_MESSAGE_LENGTH, MAX_BODY_BYTES, MAX_HISTORY_ITEMS, MAX_HISTORY_ITEM_LENGTH } from "../config/constants.js";

export function validateChatInput(body) {
  const errors = [];
  if (!body || typeof body !== "object") return ["Invalid request body"];

  const message = body.message || body.text || "";
  if (!message || typeof message !== "string") {
    errors.push("Message is required");
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.push(`Message exceeds ${MAX_MESSAGE_LENGTH} characters`);
  }

  if (body.history) {
    if (!Array.isArray(body.history)) {
      errors.push("History must be an array");
    } else if (body.history.length > MAX_HISTORY_ITEMS) {
      errors.push(`History exceeds ${MAX_HISTORY_ITEMS} items`);
    } else {
      for (const entry of body.history) {
        if (typeof entry.text === "string" && entry.text.length > MAX_HISTORY_ITEM_LENGTH) {
          errors.push(`History item exceeds ${MAX_HISTORY_ITEM_LENGTH} characters`);
          break;
        }
      }
    }
  }

  return errors;
}

export function checkBodySize(request) {
  const contentLength = Number.parseInt(request.headers.get("Content-Length") || "0", 10);
  return contentLength <= MAX_BODY_BYTES;
}

export function sanitizeText(text) {
  if (typeof text !== "string") return "";
  return text.slice(0, MAX_MESSAGE_LENGTH * 2);
}
