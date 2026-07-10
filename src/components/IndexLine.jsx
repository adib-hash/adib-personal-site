import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { researchItems } from "../data/research";
import { projects } from "../data/projects";

export default function IndexLine() {
  return (
    <div className="index-line-block">
      <div className="index-line-wrap">
        <motion.div
          className="index-line"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.span
          className="index-line-diamond"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.95, duration: 0.35, ease: "easeOut" }}
        >
          ◆
        </motion.span>
      </div>
      <div className="index-line-stats">
        <Link to="/research" className="index-line-stat">
          {researchItems.length} research pieces
        </Link>
        <span className="index-line-sep" aria-hidden="true">·</span>
        <Link to="/projects" className="index-line-stat">
          {projects.length} apps shipped
        </Link>
        <span className="index-line-sep" aria-hidden="true">·</span>
        <Link to="/writing" className="index-line-stat">
          writing at Substack
        </Link>
      </div>
    </div>
  );
}
