import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { password, order } = req.body || {};

  if (!password || password !== process.env.READING_ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!Array.isArray(order) || order.length === 0) {
    return res.status(400).json({ error: "order array is required" });
  }

  try {
    const redis = getRedis();

    for (const { id, score } of order) {
      if (id && typeof score === "number") {
        await redis.zadd("reading_links_order", { score, member: id });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("reading-reorder error:", err);
    return res.status(500).json({ error: "Failed to reorder items" });
  }
}
