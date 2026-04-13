import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X, FileText, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import GeometricAccent from "../components/GeometricAccent";
import CardCornerAccent from "../components/CardCornerAccent";

// Preload demo GIFs so modals open instantly
const demoUrls = projects.map((p) => p.demo).filter(Boolean);
if (typeof window !== "undefined") {
  demoUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
}

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

const researchItems = [
  {
    slug: "ge-aerospace",
    path: "/projects/research/ge-aerospace",
    tag: "Narrative · April 2026",
    title: "GE Aerospace: Inside the Turnaround",
    blurb:
      "A seven-chapter narrative breakdown of the post-spin story, with interactive charts on margins, backlog, and the executive comp plan.",
  },
  {
    slug: "ai-value-chain",
    path: "/projects/research/ai-value-chain",
    tag: "Teardown · April 2026",
    title: "The AI Value Chain",
    blurb:
      "Who actually captures the economics across silicon, hyperscalers, foundation models, and the application layer — with moat scores and sourced stats.",
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [showResearch, setShowResearch] = useState(false);

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

      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "16px 20px",
          marginBottom: 20,
          fontSize: 14,
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>
          All of these apps work as progressive web apps (PWAs) on iOS.
        </span>{" "}
        <span style={{ color: "var(--text-muted)" }}>
          To install from Safari: tap{" "}
          <strong style={{ color: "var(--text-muted)" }}>Share</strong> {">"}{" "}
          <strong style={{ color: "var(--text-muted)" }}>Add to Home Screen</strong> {">"}{" "}
          select{" "}
          <strong style={{ color: "var(--text-muted)" }}>"Open as Web App"</strong>.
        </span>{" "}
        <span style={{ color: "var(--text-heading)" }}>
          They'll look and feel just like native apps.
        </span>
      </div>

      <GeometricAccent />

      <div
        onClick={() => setShowResearch((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={showResearch}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setShowResearch((v) => !v);
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--accent)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "24px 24px 20px",
          marginBottom: 28,
          position: "relative",
          cursor: "pointer",
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <BookOpen size={18} style={{ color: "var(--accent)" }} />
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              margin: 0,
              fontWeight: 500,
              color: "var(--text-heading)",
            }}
          >
            Research
          </h2>
          <span
            style={{
              display: "inline-block",
              marginLeft: 4,
              color: "var(--text-muted)",
              fontSize: 14,
              transform: showResearch ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
            }}
          >
            ▾
          </span>
        </div>
        <p
          style={{
            margin: "0 0 18px",
            fontSize: 14,
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Deep-dive research pieces with interactive charts, data, and sourced
          commentary. Meant to be read slowly.
        </p>
        {showResearch && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 12,
          }}
        >
          {researchItems.map((item) => (
            <Link
              key={item.slug}
              to={item.path}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "block",
                padding: "16px 18px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "var(--font-mono, monospace)",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  color: "var(--accent)",
                  marginBottom: 8,
                }}
              >
                {item.tag}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 17,
                  fontWeight: 500,
                  color: "var(--text-heading)",
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                {item.title}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {item.blurb}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  marginTop: 12,
                  fontSize: 12,
                  color: "var(--accent)",
                  fontWeight: 500,
                }}
              >
                Read <ArrowUpRight size={12} />
              </div>
            </Link>
          ))}
        </div>
        )}
      </div>

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

              <a
                href={selected.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  fontWeight: 500,
                  margin: "0 0 8px",
                  padding: 0,
                  background: "none",
                  color: "var(--accent)",
                  textDecoration: "none",
                  transition: "opacity 0.2s",
                }}
              >
                Visit {selected.name}
                <ArrowUpRight size={20} />
              </a>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: 16,
                  margin: "0 0 24px",
                }}
              >
                {selected.description}
              </p>

              {/* Progress bar */}
              {selected.progress != null && (
                <div style={{ marginBottom: 16 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Development progress — {selected.progress}%
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 8,
                    }}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 3,
                          background:
                            i < selected.progress / 10
                              ? "var(--accent)"
                              : "var(--border)",
                          transition: "background 0.2s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* README link */}
              {selected.repo && (
                <a
                  href={`https://github.com/${selected.repo}#readme`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    color: "var(--text-muted)",
                    textDecoration: "none",
                    transition: "color 0.2s",
                    marginBottom: 24,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text-heading)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-muted)")
                  }
                >
                  <FileText size={14} />
                  View README
                </a>
              )}

              {/* Demo GIF or placeholder */}
              {selected.demo ? (
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Take me to ${selected.name}`}
                  style={{
                    display: "block",
                    position: "relative",
                    marginBottom: 24,
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    const tooltip = e.currentTarget.querySelector(".demo-tooltip");
                    if (tooltip) tooltip.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const tooltip = e.currentTarget.querySelector(".demo-tooltip");
                    if (tooltip) tooltip.style.opacity = "0";
                  }}
                >
                  <img
                    src={selected.demo}
                    alt={`${selected.name} demo`}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      display: "block",
                    }}
                  />
                  <div
                    className="demo-tooltip"
                    style={{
                      position: "absolute",
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0, 0, 0, 0.8)",
                      color: "#fff",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      pointerEvents: "none",
                    }}
                  >
                    Take me to {selected.name}
                  </div>
                </a>
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
