import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { researchItems } from "../data/research";
import GeometricAccent from "../components/GeometricAccent";

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
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(28px, 5vw, 36px)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          marginTop: 0,
          fontWeight: 400,
        }}
      >
        Research
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 16 }}>
        Deep research pieces published as interactive websites
      </p>

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
        {researchItems.map((item) => (
          <motion.div key={item.slug} variants={cardVariants}>
            <Link to={item.path} className="research-item" style={{ padding: "20px 22px" }}>
              <div
                style={{
                  fontSize: 12,
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 10,
                }}
              >
                {item.tag}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "var(--text-heading)",
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </div>
              <div
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
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
