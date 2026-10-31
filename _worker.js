const DEV_BACKEND = "https://checkmaitrex-ai-dev.elianssotero11.workers.dev";

function stripApiPrefix(pathname) {
  return pathname.startsWith("/api") ? pathname : pathname;
}

async function proxyToBackend(request) {
  const url = new URL(request.url);
  const targetUrl = new URL(url.pathname + url.search, DEV_BACKEND);

  const headers = new Headers(request.headers);
  headers.set("Host", targetUrl.hostname);
  headers.set("X-Forwarded-Host", url.host);
  headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));

  const init = {
    method: request.method,
    headers,
    redirect: "manual"
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  try {
    const upstreamResponse = await fetch(targetUrl, init);
    const responseHeaders = new Headers(upstreamResponse.headers);
    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    responseHeaders.set("Access-Control-Max-Age", "86400");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Upstream AI backend is unavailable right now."
      }),
      {
        status: 502,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return proxyToBackend(request);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }

    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Not found", { status: 404 });
  }
};
