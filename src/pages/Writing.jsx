import { useCachedFetch } from "../hooks/useCachedFetch";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import GeometricAccent from "../components/GeometricAccent";
import CardCornerAccent from "../components/CardCornerAccent";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

function formatDate(dateStr) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function Writing() {
  const { data, loading, error } = useCachedFetch("/api/substack");
  const posts = data || [];

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <Seo
        title="Writing — Adib Choudhury"
        description="Essays and notes from my Substack on tech, business, and spirituality."
      />
      <PageHeader
        title="Writing"
        subtitle="Essays and notes from my Substack."
        action={
          <a
            href="https://notesfromadib.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent"
          >
            Subscribe
          </a>
        }
      />

      <GeometricAccent />

      {loading && (
        <p style={{ color: "var(--text-muted)" }}>Loading posts...</p>
      )}

      {error && (
        <p style={{ color: "var(--text-muted)" }}>
          Could not load posts right now. Visit{" "}
          <a
            href="https://notesfromadib.substack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            the Substack
          </a>{" "}
          directly.
        </p>
      )}

      {!loading && !error && posts.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>
          No posts yet. Check back soon, or{" "}
          <a
            href="https://notesfromadib.substack.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            visit the Substack
          </a>
          .
        </p>
      )}

      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: 24 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {posts.map((post, i) => {
          const preview = stripHtml(post.description || "").slice(0, 160);
          const meta = [formatDate(post.pubDate), post.readingTime ? `${post.readingTime} min read` : null]
            .filter(Boolean)
            .join(" · ");
          return (
            <motion.a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              className="writing-card card-hover"
            >
              <CardCornerAccent corner="top-right" />
              <CardCornerAccent corner="bottom-left" />
              <div className="writing-card-row">
                {post.image && (
                  <div className="writing-card-thumb">
                    <img src={post.image} alt="" loading="lazy" />
                  </div>
                )}
                <div className="writing-card-content">
                  <div>
                    <h3 className="writing-card-title">{post.title}</h3>
                    {meta && <p className="writing-card-meta">{meta}</p>}
                    {preview && (
                      <p className="writing-card-preview">
                        {preview}
                        {preview.length >= 160 ? "..." : ""}
                      </p>
                    )}
                  </div>
                  <ArrowUpRight
                    size={16}
                    style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }}
                  />
                </div>
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
