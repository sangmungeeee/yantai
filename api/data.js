// Vercel Storage(Upstash) 환경변수 이름은 접두어가 붙을 수 있어서 자동으로 찾음
function findEnv() {
  const env = process.env;
  const keys = Object.keys(env);
  const urlKey = keys.find(k => /KV_REST_API_URL$/.test(k)) || keys.find(k => /REDIS_REST_URL$/.test(k)) || keys.find(k => /REST_API_URL$/.test(k));
  if (!urlKey) return {};
  const base = urlKey.replace(/_?(KV_REST_API_URL|REDIS_REST_URL|REST_API_URL)$/, "");
  const tokKey = keys.find(k => k.startsWith(base) && /(KV_REST_API_TOKEN|REDIS_REST_TOKEN|REST_API_TOKEN)$/.test(k) && !/READ_ONLY/.test(k))
    || keys.find(k => /(KV_REST_API_TOKEN|REDIS_REST_TOKEN)$/.test(k) && !/READ_ONLY/.test(k));
  return { url: env[urlKey], token: tokKey && env[tokKey] };
}
const { url: URL_, token: TOKEN } = findEnv();
const KEY = "yantai-trip";

async function redis(cmd) {
  const r = await fetch(URL_, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error("redis " + r.status);
  return (await r.json()).result;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!URL_ || !TOKEN) return res.status(503).json({ error: "storage not connected" });
  try {
    if (req.method === "GET") {
      const v = await redis(["GET", KEY]);
      return res.status(200).json(v ? JSON.parse(v) : null);
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      if (!body || typeof body.base !== "number" || typeof body.data !== "object") return res.status(400).json({ error: "bad body" });
      const s = JSON.stringify({ base: body.base, data: body.data, savedAt: new Date().toISOString() });
      if (s.length > 500000) return res.status(413).json({ error: "too large" });
      await redis(["SET", KEY, s]);
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
};
