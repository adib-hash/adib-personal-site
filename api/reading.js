import { getFirestore } from "./_firebase.js";

export default async function handler(req, res) {
  try {
    const db = getFirestore();
    const snapshot = await db
      .collection("reading_links")
      .orderBy("createdAt", "desc")
      .get();

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (err) {
    console.error("reading error:", err);
    return res.status(500).json({ error: "Failed to fetch reading list" });
  }
}
