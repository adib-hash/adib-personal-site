import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useCachedFetch } from "../hooks/useCachedFetch";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
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
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const BATCH_SIZE = 24;

export default function Reading() {
  const { data, loading, error } = useCachedFetch("/api/reading");
  const allItems = useMemo(() => data || [], [data]);
  const [displayed, setDisplayed] = useState(BATCH_SIZE);
  const sentinelRef = useRef(null);

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
      <Seo
        title="Reading — Adib Choudhury"
        description="Things I've found worth sharing — articles, essays, and links."
      />
      <PageHeader
        title="Reading"
        subtitle="Things I've found worth sharing."
        action={
          <Link
            to="/reading/add"
            aria-label="Admin login"
            title="Admin login"
            className="admin-lock-link"
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
              flexShrink: 0,
            }}
          >
            <Lock size={14} />
          </Link>
        }
      />

      <GeometricAccent />

      {loading && (
        <div className="reading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="reading-skeleton" />
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
        className="reading-grid"
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
      className="reading-card card-hover card-hover-lift"
    >
      <CardCornerAccent corner="top-right" />
      <CardCornerAccent corner="bottom-left" />

      {hasImage ? (
        <div className="reading-card-image-wrap">
          <img
            src={item.ogImage}
            alt=""
            loading="lazy"
            onError={() => setImgFailed(true)}
          />
          {item.domain && (
            <span className="reading-card-domain-badge">{item.domain}</span>
          )}
        </div>
      ) : (
        <div className="reading-card-accent-bar" />
      )}

      <div className={`reading-card-body${hasImage ? "" : " compact"}`}>
        <h3 className="reading-card-title" style={{ fontSize: hasImage ? 17 : 20 }}>
          {item.title}
        </h3>
        {item.author && <p className="reading-card-author">by {item.author}</p>}
        {item.note && <p className="reading-card-note">{item.note}</p>}
        <div className="reading-card-footer">
          {!hasImage && (
            <span className="reading-card-domain-text">{item.domain}</span>
          )}
          <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.a>
  );
}
