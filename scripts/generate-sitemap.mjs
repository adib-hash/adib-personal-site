import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { researchItems } from "../src/data/research.js";

const SITE_URL = "https://adib.ihsan.build";
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

const staticRoutes = ["/", "/research", "/projects", "/writing", "/reading"];
const researchRoutes = researchItems.map((item) => item.path);
const routes = [...staticRoutes, ...researchRoutes];

const urlset = routes
  .map(
    (path) => `  <url>
    <loc>${SITE_URL}${path}</loc>
  </url>`
  )
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(resolve(publicDir, "sitemap.xml"), sitemap);
writeFileSync(resolve(publicDir, "robots.txt"), robots);

console.log(`Generated sitemap.xml with ${routes.length} routes and robots.txt`);
