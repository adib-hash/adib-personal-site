import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowUpDown } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { researchItems } from "../data/research";
import GeometricAccent from "../components/GeometricAccent";
import Seo from "../components/Seo";
import PageHeader from "../components/PageHeader";
import EmberDrift from "../components/EmberDrift";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
};

const TYPES = ["All", "Narrative", "Interactive", "Quality of Earnings", "Teardown"];

export default function Research() {
  const [searchParams, setSearchParams] = useSearchParams();
  const prefersReducedMotion = useReducedMotion();

  const activeType = searchParams.get("type") || "All";
  const sort = searchParams.get("sort") === "oldest" ? "oldest" : "newest";

  function setType(type) {
    const next = new URLSearchParams(searchParams);
    if (type === "All") next.delete("type");
    else next.set("type", type);
    setSearchParams(next, { replace: true });
  }

  function toggleSort() {
    const next = new URLSearchParams(searchParams);
    if (sort === "newest") next.set("sort", "oldest");
    else next.delete("sort");
    setSearchParams(next, { replace: true });
  }

  const filtered =
    activeType === "All"
      ? researchItems
      : researchItems.filter((item) => item.type === activeType);
  const sorted = sort === "oldest" ? [...filtered].reverse() : filtered;

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <Seo
        title="Research — Adib Choudhury"
        description="Deep research pieces published as interactive websites — narrative teardowns, quality-of-earnings diagnostics, and interactive data explorers."
      />
      {/* Embers drift behind the masthead only — the pieces themselves stay still. */}
      <div className="research-masthead">
        <EmberDrift opacity={0.55} />
        <PageHeader
          title="Research"
          subtitle="Deep research pieces published as interactive websites"
        />
        <GeometricAccent />
      </div>

      <div className="research-filters">
        <div className="research-filter-pills">
          {TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`research-filter-pill${activeType === type ? " active" : ""}`}
              aria-pressed={activeType === type}
              onClick={() => setType(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <button type="button" className="research-sort-toggle" onClick={toggleSort}>
          {sort === "newest" ? "Newest first" : "Oldest first"}
          <ArrowUpDown size={13} />
        </button>
      </div>

      <motion.div
        layout={!prefersReducedMotion}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {sorted.map((item) => {
          const Wrapper = item.external ? "a" : Link;
          const wrapperProps = item.external
            ? { href: item.path, className: `research-item${item.featured ? " featured" : ""}` }
            : { to: item.path, className: `research-item${item.featured ? " featured" : ""}` };
          return (
            <motion.div
              key={item.slug}
              layout={!prefersReducedMotion}
              variants={cardVariants}
            >
              <Wrapper {...wrapperProps}>
                <div className="research-card-eyebrow">
                  <span className="research-card-type">{item.type}</span>
                  <span className="research-card-date">{item.date}</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: item.featured ? 22 : 18,
                    fontWeight: 400,
                    color: "var(--text-heading)",
                    marginBottom: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </div>
                <div
                  className={item.featured ? "clamp-4" : "clamp-3"}
                  style={{
                    fontSize: 13.5,
                    color: "var(--text-muted)",
                    lineHeight: 1.55,
                  }}
                >
                  {item.blurb}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 14,
                    fontSize: 12,
                    color: "var(--accent)",
                    fontWeight: 500,
                  }}
                >
                  Read <ArrowUpRight size={12} />
                </div>
              </Wrapper>
            </motion.div>
          );
        })}
      </motion.div>

      {sorted.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>No pieces match this filter.</p>
      )}
    </motion.div>
  );
}
