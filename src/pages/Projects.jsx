import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { projects } from "../data/projects";
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

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: 12, transition: { duration: 0.15 } },
};

export default function Projects() {
  const [selected, setSelected] = useState(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selected) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [selected]);

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "36px",
          marginBottom: 8,
          marginTop: 0,
        }}
      >
        Projects
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 16, fontSize: 16 }}>
        Personal software, demos/concepts, and my foray into building with AI
      </p>

      <GeometricAccent />

      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {projects.map((project) => (
          <motion.button
            key={project.name}
            variants={cardVariants}
            onClick={() => setSelected(project)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 24,
              background: "var(--card-bg)",
              borderRadius: 12,
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
              textDecoration: "none",
              color: "inherit",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: "inherit",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "var(--card-shadow)";
            }}
          >
            <CardCornerAccent corner="top-right" />
            <CardCornerAccent corner="bottom-left" />
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 20,
                    margin: 0,
                    fontWeight: 500,
                    color: "var(--text-heading)",
                  }}
                >
                  {project.name}
                </h3>
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--text-muted)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {project.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Project Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="modal-overlay"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="modal-content"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="modal-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                  margin: "0 0 8px",
                  paddingRight: 36,
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    margin: 0,
                    fontWeight: 500,
                  }}
                >
                  {selected.name}
                </h2>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 8,
                    background: "var(--accent)",
                    color: "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "opacity 0.2s",
                    flexShrink: 0,
                  }}
                >
                  Visit {selected.name}
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 16,
                  margin: "0 0 24px",
                }}
              >
                {selected.description}
              </p>

              {/* Demo GIF or placeholder */}
              {selected.demo ? (
                <img
                  src={selected.demo}
                  alt={`${selected.name} demo`}
                  style={{
                    width: "100%",
                    borderRadius: 8,
                    marginBottom: 24,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16 / 10",
                    background: "var(--bg)",
                    borderRadius: 8,
                    border: "1px dashed var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 24,
                    color: "var(--text-muted)",
                    fontSize: 14,
                  }}
                >
                  Demo coming soon
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
