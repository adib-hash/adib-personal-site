import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import GeometricAccent from "../components/GeometricAccent";
import CardCornerAccent from "../components/CardCornerAccent";

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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/substack");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 5vw, 36px)",
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
              margin: "0 0 8px",
            }}
          >
            Writing
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: 16, margin: 0 }}>
            Essays and notes from my Substack.
          </p>
        </div>
        <a
          href="https://notesfromadib.substack.com/subscribe"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 8,
            background: "var(--accent)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Subscribe
        </a>
      </div>

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
          return (
            <motion.a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              style={{
                position: "relative",
                display: "block",
                padding: 24,
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <CardCornerAccent corner="top-right" />
              <CardCornerAccent corner="bottom-left" />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div>
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      margin: "0 0 6px",
                      fontWeight: 500,
                    }}
                  >
                    {post.title}
                  </h3>
                  {formatDate(post.pubDate) && (
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-muted)",
                        margin: "0 0 8px",
                      }}
                    >
                      {formatDate(post.pubDate)}
                    </p>
                  )}
                  {preview && (
                    <p
                      style={{
                        fontSize: 15,
                        color: "var(--text-muted)",
                        margin: 0,
                        lineHeight: 1.5,
                      }}
                    >
                      {preview}
                      {preview.length >= 160 ? "..." : ""}
                    </p>
                  )}
                </div>
                <ArrowUpRight
                  size={16}
                  style={{
                    color: "var(--text-muted)",
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                />
              </div>
            </motion.a>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
