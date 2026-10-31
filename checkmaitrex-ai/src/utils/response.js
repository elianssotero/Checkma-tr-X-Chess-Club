export function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
  });
}

export function errorResponse(message, status = 400, extraHeaders = {}) {
  return jsonResponse({ error: message, success: false }, status, extraHeaders);
}

export function generateRequestId() {
  return `req_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
