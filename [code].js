// Cloudflare Pages Function: GET /api/pcr/OIDD-6360
// Fetches public course data from Penn Course Review server-side, so the page avoids the browser's cross-site block.
export async function onRequestGet({ params }) {
  const code = String(params.code || "").toUpperCase();
  if (!/^[A-Z]{2,5}-\d{3,4}$/.test(code)) {
    return new Response(JSON.stringify({ detail: "Bad course code" }), { status: 400, headers: { "content-type": "application/json" } });
  }
  const upstream = await fetch(`https://penncoursereview.com/api/base/current/courses/${code}/?format=json`, {
    headers: { Accept: "application/json", "User-Agent": "coursematch-optimizer" },
    cf: { cacheTtl: 3600, cacheEverything: true },
  });
  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
  });
}
