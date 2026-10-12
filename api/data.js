// 앱에서 고친 일정 데이터를 Upstash Redis(Vercel Storage)에 저장/불러오기
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
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
