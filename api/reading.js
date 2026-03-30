import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  try {
    const redis = getRedis();

    // One-time migration from old sorted set model
    const oldExists = await redis.exists("reading_links");
    if (oldExists) {
      const oldItems = await redis.zrange("reading_links", "+inf", "-inf", {
        byScore: true,
        rev: true,
      });

      for (const entry of oldItems) {
        const item = typeof entry === "string" ? JSON.parse(entry) : entry;
        const id = crypto.randomUUID();
        await redis.hset(`reading_link:${id}`, {
          url: item.url || "",
          title: item.title || "",
          ogImage: item.ogImage || "",
          domain: item.domain || "",
          createdAt: item.createdAt || new Date().toISOString(),
          author: "",
          note: "",
        });
        const score = new Date(item.createdAt).getTime() || Date.now();
        await redis.zadd("reading_links_order", { score, member: id });
      }

      await redis.del("reading_links");
    }

    // Read all IDs from sorted set (newest first)
    const ids = await redis.zrange("reading_links_order", "+inf", "-inf", {
      byScore: true,
      rev: true,
    });

    if (!ids || ids.length === 0) {
      if (!req.url?.includes("bust=")) {
        res.setHeader(
          "Cache-Control",
          "s-maxage=1800, stale-while-revalidate=600"
        );
      }
      return res.status(200).json([]);
    }

    // Fetch all hashes
    const items = [];
    for (const id of ids) {
      const data = await redis.hgetall(`reading_link:${id}`);
      if (data && Object.keys(data).length > 0) {
        items.push({ id, ...data });
      }
    }

    if (!req.url?.includes("bust=")) {
      res.setHeader(
        "Cache-Control",
        "s-maxage=1800, stale-while-revalidate=600"
      );
    }
    return res.status(200).json(items);
  } catch (err) {
    console.error("reading error:", err);
    return res.status(500).json({ error: "Failed to fetch reading list" });
  }
}
