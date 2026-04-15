import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import GeometricAccent from "../components/GeometricAccent";
import CardCornerAccent from "../components/CardCornerAccent";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const BATCH_SIZE = 24;

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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "36px",
              margin: "0 0 8px",
            }}
          >
            Reading
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: 16,
              fontSize: 16,
            }}
          >
            Things I've found worth sharing.
          </p>
        </div>

        <Link
          to="/reading/add"
          aria-label="Admin login"
          title="Admin login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            marginTop: 6,
            borderRadius: 8,
            color: "var(--text-muted)",
            border: "1px solid var(--border)",
            background: "transparent",
            opacity: 0.55,
            transition: "opacity 0.2s, color 0.2s, border-color 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "1";
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.borderColor = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "0.55";
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <Lock size={14} />
        </Link>
      </div>

      <GeometricAccent />

      {loading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border)",
                height: 260,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
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
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item) => (
          <ReadingCard key={item.id} item={item} />
        ))}
      </motion.div>

      {displayed < allItems.length && (
        <div ref={sentinelRef} style={{ height: 1 }} />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </motion.div>
  );
}

function ReadingCard({ item }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = item.ogImage && !imgFailed;

  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        background: "var(--card-bg)",
        borderRadius: 12,
        border: "1px solid var(--border)",
        boxShadow: "var(--card-shadow)",
        textDecoration: "none",
        color: "inherit",
        overflow: "hidden",
        transition: "border-color 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <CardCornerAccent corner="top-right" />
      <CardCornerAccent corner="bottom-left" />

      {hasImage ? (
        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            background: "#1a1a1a",
          }}
        >
          <img
            src={item.ogImage}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      ) : (
        <div
          style={{
            height: 3,
            background: "var(--accent)",
            opacity: 0.2,
          }}
        />
      )}

      <div
        style={{
          padding: hasImage ? "16px 20px 20px" : "24px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: hasImage ? 17 : 20,
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.35,
            color: "var(--text-heading)",
          }}
        >
          {item.title}
        </h3>
        {item.author && (
          <p
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
              margin: "4px 0 0",
            }}
          >
            by {item.author}
          </p>
        )}
        {item.note && (
          <p
            style={{
              fontSize: 14,
              color: "var(--text)",
              margin: "8px 0 0",
              lineHeight: 1.45,
              fontStyle: "italic",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.note}
          </p>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: 12,
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "var(--text-muted)",
            }}
          >
            {item.domain}
          </span>
          <ArrowUpRight
            size={14}
            style={{ color: "var(--text-muted)", flexShrink: 0 }}
          />
        </div>
      </div>
    </motion.a>
  );
}
