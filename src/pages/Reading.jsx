import { useState, useEffect, useCallback, useRef } from "react";
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

const TYPE_COLORS = {
  Article: "var(--accent)",
  Book: "#6b8e5a",
  Podcast: "#8b6bb5",
};

const BATCH_SIZE = 20;

export default function Reading() {
  const [allItems, setAllItems] = useState([]);
  const [displayed, setDisplayed] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await fetch("/api/reading");
        if (!res.ok) throw new Error("Failed to fetch reading list");
        const data = await res.json();
        setAllItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  const loadMore = useCallback(() => {
    setDisplayed((prev) => Math.min(prev + BATCH_SIZE, allItems.length));
  }, [allItems.length]);

  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [loadMore, allItems]);

  const items = allItems.slice(0, displayed);

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "36px",
          margin: "0 0 8px",
        }}
      >
        Reading & Listening
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 16 }}>
        Things I've found worth sharing.
      </p>

      <GeometricAccent />

      {loading && (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}

      {error && (
        <p style={{ color: "var(--text-muted)" }}>
          Could not load the reading list right now.
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>Nothing here yet. Check back soon.</p>
      )}

      <motion.div
        style={{ display: "flex", flexDirection: "column", gap: 16 }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <motion.a
            key={i}
            href={item.url}
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
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 6,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 18,
                      margin: 0,
                      fontWeight: 500,
                    }}
                  >
                    {item.title}
                  </h3>
                  {item.type && (
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: 4,
                        background:
                          (TYPE_COLORS[item.type] || "var(--accent)") + "18",
                        color: TYPE_COLORS[item.type] || "var(--accent)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.type}
                    </span>
                  )}
                </div>
                {item.author && (
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--text-muted)",
                      margin: "0 0 4px",
                    }}
                  >
                    {item.author}
                  </p>
                )}
                {item.note && (
                  <p
                    style={{
                      fontSize: 15,
                      color: "var(--text)",
                      margin: "8px 0 0",
                      lineHeight: 1.5,
                      fontStyle: "italic",
                    }}
                  >
                    {item.note}
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
        ))}
      </motion.div>

      {displayed < allItems.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}
    </motion.div>
  );
}
