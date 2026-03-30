import { getRedis } from "./_redis.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, password, fields } = req.body || {};

  if (!password || password !== process.env.READING_ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id || !fields || typeof fields !== "object") {
    return res.status(400).json({ error: "id and fields are required" });
  }

  // Only allow updating these fields
  const allowed = ["title", "author", "note"];
  const updates = {};
  for (const key of allowed) {
    if (key in fields) {
      updates[key] = String(fields[key]);
    }
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No valid fields to update" });
  }

  try {
    const redis = getRedis();

    const exists = await redis.exists(`reading_link:${id}`);
    if (!exists) {
      return res.status(404).json({ error: "Item not found" });
    }

    await redis.hset(`reading_link:${id}`, updates);
    const updated = await redis.hgetall(`reading_link:${id}`);

    return res.status(200).json({ id, ...updated });
  } catch (err) {
    console.error("reading-update error:", err);
    return res.status(500).json({ error: "Failed to update item" });
  }
}
