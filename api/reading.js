export default async function handler(req, res) {
  const SHEET_URL = process.env.GOOGLE_SHEET_CSV_URL;

  if (!SHEET_URL) {
    return res.status(500).json({
      error: "GOOGLE_SHEET_CSV_URL environment variable not set",
    });
  }

  try {
    const response = await fetch(SHEET_URL);
    if (!response.ok) {
      return res.status(502).json({ error: "Failed to fetch sheet" });
    }

    const csv = await response.text();
    const lines = csv.split("\n").filter((line) => line.trim());

    if (lines.length < 2) {
      return res.status(200).json([]);
    }

    // Parse CSV header
    const headers = parseCSVLine(lines[0]).map((h) => h.trim().toLowerCase());
    const titleIdx = headers.indexOf("title");
    const authorIdx = headers.indexOf("author");
    const typeIdx = headers.indexOf("type");
    const urlIdx = headers.indexOf("url");
    const noteIdx = headers.indexOf("note");
    const dateIdx = headers.indexOf("date added");

    const items = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (!cols[titleIdx]) continue;

      items.push({
        title: cols[titleIdx] || "",
        author: cols[authorIdx] || "",
        type: cols[typeIdx] || "",
        url: cols[urlIdx] || "",
        note: cols[noteIdx] || "",
        dateAdded: cols[dateIdx] || "",
      });
    }

    // Sort by date added descending (newest first)
    items.sort((a, b) => {
      if (!a.dateAdded) return 1;
      if (!b.dateAdded) return -1;
      return new Date(b.dateAdded) - new Date(a.dateAdded);
    });

    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return res.status(200).json(items);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}
