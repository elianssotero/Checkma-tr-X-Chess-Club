export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API requests → proxy to the standalone Worker (checkmaitrex-ai)
    if (url.pathname.startsWith('/api/') || url.pathname === '/health') {
      const target = 'https://checkmaitrex-ai.elianssotero11.workers.dev' + url.pathname + url.search;
      const headers = new Headers(request.headers);
      headers.delete('host');
      const init = { method: request.method, headers };
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        init.body = await request.arrayBuffer();
      }
      try {
        const resp = await fetch(target, init);
        const newHeaders = new Headers(resp.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*');
        return new Response(resp.body, { status: resp.status, headers: newHeaders });
      } catch (e) {
        return new Response(JSON.stringify({ error: 'AI service unavailable', detail: e.message }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    }

    // Everything else → serve static files (HTML, CSS, JS, images)
    return env.ASSETS.fetch(request);
  }
};
