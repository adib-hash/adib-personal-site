import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { researchItems } from "../data/research";
import GeometricAccent from "../components/GeometricAccent";
import Seo from "../components/Seo";

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

export default function Research() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <Seo
        title="Research — Adib Choudhury"
        description="Deep research pieces published as interactive websites — narrative teardowns, quality-of-earnings diagnostics, and interactive data explorers."
      />
      <h1 className="page-title">Research</h1>
      <p className="page-subtitle">Deep research pieces published as interactive websites</p>

      <GeometricAccent />

      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {researchItems.map((item) => {
          const Wrapper = item.external ? "a" : Link;
          const wrapperProps = item.external
            ? { href: item.path, className: `research-item${item.featured ? " featured" : ""}` }
            : { to: item.path, className: `research-item${item.featured ? " featured" : ""}` };
          return (
            <motion.div key={item.slug} variants={cardVariants}>
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
    </motion.div>
  );
}
