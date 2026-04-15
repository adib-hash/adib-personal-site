import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, X, FileText, ChevronDown, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { projects } from "../data/projects";
import GeometricAccent from "../components/GeometricAccent";
import CardCornerAccent from "../components/CardCornerAccent";

// ─── Motion variants ──────────────────────────────────────────

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 16,
    transition: { duration: 0.18, ease: [0.25, 1, 0.5, 1] },
  },
};

// ─── Magnetic card ────────────────────────────────────────────
// Each card tracks cursor position relative to its own center
// and drives independent spring values for translate + 3D tilt.
// Touch devices and prefers-reduced-motion both get a static card.

const SPRING = { stiffness: 200, damping: 22, mass: 0.1 };

function ProjectCard({ project, onClick, variants }) {
  const ref = useRef(null);

  // Raw mouse position — normalised to [-1, 1] relative to card center
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed versions
  const smoothX = useSpring(mouseX, SPRING);
  const smoothY = useSpring(mouseY, SPRING);

  // Translate: ±6px horizontal, ±4px vertical
  const translateX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const translateY = useTransform(smoothY, [-1, 1], [-4, 4]);

  // 3D tilt: ±3° — subtle perspective warp
  const rotateY = useTransform(smoothX, [-1, 1], [-3, 3]);
  const rotateX = useTransform(smoothY, [-1, 1], [3, -3]); // inverted: cursor above = tilt toward viewer

  const handleMouseMove = (e) => {
    // Skip on touch or when user prefers reduced motion
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / (rect.width / 2));
    mouseY.set((e.clientY - rect.top - rect.height / 2) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.button
      ref={ref}
      variants={variants}
      className="project-card"
      onClick={() => onClick(project)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: translateX,
        y: translateY,
        rotateX,
        rotateY,
        transformPerspective: 800,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 24,
        background: "var(--card-bg)",
        borderRadius: 12,
        textDecoration: "none",
        color: "inherit",
        textAlign: "left",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "inherit",
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
              fontWeight: 400,
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
            lineHeight: 1.55,
          }}
        >
          {project.description}
        </p>
      </div>
    </motion.button>
  );
}

// ─── Research items ───────────────────────────────────────────

const researchItems = [
  {
    slug: "openai-origin",
    path: "/projects/research/openai-origin",
    tag: "Narrative · April 2026",
    title: "OpenAI: From Founding to Firing",
    blurb:
      "Eight years of OpenAI, from the 2015 Rosewood dinner to the 106-hour November 2023 firing that almost unmade the company. Musk's takeover bid, the capped-profit pivot, the Anthropic exodus, ChatGPT's hockey stick, and Satya Nadella's weekend — with an hour-by-hour firing timeline and forty sourced citations.",
  },
  {
    slug: "legacy-hollywood",
    path: "/projects/research/legacy-hollywood",
    tag: "Narrative · April 2026",
    title: "Legacy Hollywood: The Endgame",
    blurb:
      "How a thirty-four-day-old company, a Gulf sovereign check, and a twenty-year plan outbid Netflix for Warner Bros. The full Paramount-Skydance-WBD saga with interactive charts on the bidding war, the $111B financing structure, and the empire's post-close balance sheet.",
  },
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

// ─── Page ─────────────────────────────────────────────────────

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
          fontSize: "clamp(28px, 5vw, 36px)",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
          marginBottom: 8,
          marginTop: 0,
          fontWeight: 400,
        }}
      >
        Projects
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: 16 }}>
        Personal software, demos/concepts, and my foray into building with AI
      </p>

      {/* PWA install note — inline, no card */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          paddingBottom: 16,
          marginBottom: 24,
          fontSize: 14,
          color: "var(--text-muted)",
          lineHeight: 1.65,
        }}
      >
        <span style={{ color: "var(--text-heading)", fontWeight: 500 }}>
          All of these apps work as progressive web apps (PWAs) on iOS.
        </span>{" "}
        To install from Safari: tap{" "}
        <strong style={{ color: "var(--text-muted)" }}>Share</strong> {">"}{" "}
        <strong style={{ color: "var(--text-muted)" }}>Add to Home Screen</strong>{" "}
        {">"} select{" "}
        <strong style={{ color: "var(--text-heading)" }}>"Open as Web App"</strong>.
        {" "}They'll look and feel just like native apps.
      </div>

      {/* Research — clean disclosure, no card-in-card */}
      <div style={{ marginBottom: 32 }}>
        <button
          className="research-toggle"
          onClick={() => setShowResearch((v) => !v)}
          aria-expanded={showResearch}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <BookOpen size={16} style={{ color: "var(--accent)", flexShrink: 0 }} />
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontWeight: 400,
                color: "var(--text-heading)",
              }}
            >
              Research
            </span>
            <span className="research-toggle-label">4 deep-dives</span>
          </div>
          <motion.span
            animate={{ rotate: showResearch ? 180 : 0 }}
            transition={{ duration: 0.25, ease: [0.25, 1, 0.5, 1] }}
            style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}
          >
            <ChevronDown size={17} />
          </motion.span>
        </button>

        <AnimatePresence initial={false}>
          {showResearch && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.25, 1, 0.5, 1] }}
              style={{ overflow: "hidden" }}
            >
              <p
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  margin: "16px 0",
                  lineHeight: 1.6,
                  maxWidth: "60ch",
                }}
              >
                Deep-dive research pieces with interactive charts, data, and sourced
                commentary. Meant to be read slowly.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                  gap: 12,
                  marginBottom: 8,
                }}
              >
                {researchItems.map((item) => (
                  <Link key={item.slug} to={item.path} className="research-item">
                    <div
                      style={{
                        fontSize: 12,
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
                        fontWeight: 400,
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <GeometricAccent />

      {/* Magnetic project grid */}
      <motion.div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            onClick={setSelected}
            variants={cardVariants}
          />
        ))}
      </motion.div>

      {/* Project modal */}
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
                  fontWeight: 400,
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
                  lineHeight: 1.65,
                }}
              >
                {selected.description}
              </p>

              {/* Progress bar — blocks animate in sequentially */}
              {selected.progress != null && (
                <div style={{ marginBottom: 20 }}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Development progress — {selected.progress}%
                  </span>
                  <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                    {Array.from({ length: 10 }, (_, i) => {
                      const filled = i < selected.progress / 10;
                      return (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: 0.18 + i * 0.045,
                            duration: 0.3,
                            ease: [0.25, 1, 0.5, 1],
                          }}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 3,
                            background: filled ? "var(--accent)" : "var(--border)",
                          }}
                        />
                      );
                    })}
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
                    const t = e.currentTarget.querySelector(".demo-tooltip");
                    if (t) t.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const t = e.currentTarget.querySelector(".demo-tooltip");
                    if (t) t.style.opacity = "0";
                  }}
                >
                  <img
                    src={selected.demo}
                    alt={`${selected.name} demo`}
                    style={{ width: "100%", borderRadius: 8, display: "block" }}
                  />
                  <div
                    className="demo-tooltip"
                    style={{
                      position: "absolute",
                      top: 12,
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "rgba(0,0,0,0.8)",
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
