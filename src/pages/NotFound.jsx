import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Seo from "../components/Seo";
import GeometricAccent from "../components/GeometricAccent";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const links = [
  { to: "/", label: "Home" },
  { to: "/research", label: "Research" },
  { to: "/projects", label: "Projects" },
];

export default function NotFound() {
  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <Seo
        title="Page Not Found — Adib Choudhury"
        description="This page doesn't exist."
      />
      <div className="not-found-monogram">AC</div>
      <h1 className="page-title">This page doesn't exist</h1>
      <p className="page-subtitle">
        The link may be broken, or the page may have moved.
      </p>

      <GeometricAccent />

      <div className="not-found-links">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="not-found-link">
            {link.label}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
