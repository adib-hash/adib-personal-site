import { motion } from "framer-motion";

const starVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: { delay: 0.3 + i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

export default function GeometricAccent() {
  return (
    <motion.svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0.2, display: "block", margin: "32px 0" }}
      aria-hidden="true"
      initial="hidden"
      animate="visible"
    >
      {[0, 32, 64, 96].map((x, i) => (
        <motion.g
          key={x}
          transform={`translate(${x}, 0)`}
          custom={i}
          variants={starVariants}
        >
          <path
            d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
            fill="var(--accent)"
          />
          <path
            d="M12 5 L13.5 10.5 L19 12 L13.5 13.5 L12 19 L10.5 13.5 L5 12 L10.5 10.5 Z"
            fill="var(--bg)"
          />
        </motion.g>
      ))}
    </motion.svg>
  );
}
