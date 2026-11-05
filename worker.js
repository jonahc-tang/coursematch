// Cloudflare Worker: serves the site from ./public and proxies Penn Course Review.
// GET /api/pcr/OIDD-6360 -> https://penncoursereview.com/api/base/current/courses/OIDD-6360/?format=json
// (Browsers block the page from reading penncoursereview.com directly, so the Worker fetches it server-side.)
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const m = url.pathname.match(/^\/api\/pcr\/([A-Za-z]{2,5}-\d{3,4})\/?$/);
    if (m) {
      if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
      const code = m[1].toUpperCase();
      const upstream = await fetch(`https://penncoursereview.com/api/base/current/courses/${code}/?format=json`, {
        headers: { Accept: "application/json", "User-Agent": "coursematch-optimizer" },
        cf: { cacheTtl: 3600, cacheEverything: true },
      });
      return new Response(await upstream.text(), {
        status: upstream.status,
        headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
      });
    }
    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ detail: "Bad course code" }), { status: 400, headers: { "content-type": "application/json" } });
    }
    return env.ASSETS.fetch(request);
  },
};
