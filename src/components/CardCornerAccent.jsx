import { motion } from "framer-motion";

const cornerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, delay: 0.15 } },
};

const rotations = {
  "top-left": "rotate(0deg)",
  "top-right": "rotate(90deg)",
  "bottom-right": "rotate(180deg)",
  "bottom-left": "rotate(270deg)",
};

const positions = {
  "top-left": { top: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "bottom-right": { bottom: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
};

export default function CardCornerAccent({ corner = "top-right" }) {
  return (
    <motion.svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      variants={cornerVariants}
      style={{
        position: "absolute",
        ...positions[corner],
        transform: rotations[corner],
        opacity: 0.2,
        pointerEvents: "none",
      }}
    >
      {/* L-bracket corner lines */}
      <line x1="0" y1="0" x2="0" y2="10" stroke="var(--accent)" strokeWidth="0.75" />
      <line x1="0" y1="0" x2="10" y2="0" stroke="var(--accent)" strokeWidth="0.75" />
      {/* Small 4-pointed diamond at the vertex */}
      <path d="M0 -2 L1.2 0 L0 2 L-1.2 0 Z" fill="var(--accent)" />
    </motion.svg>
  );
}
