import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { researchItems } from "../data/research";

export default function ResearchFooter({ currentSlug }) {
  const [copied, setCopied] = useState(false);

  const related = researchItems
    .filter((item) => item.slug !== currentSlug && !item.external)
    .slice(0, 3);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <footer className="research-footer">
      <div className="research-footer-top">
        <span className="research-footer-label">More from the index</span>
        <button type="button" className="research-footer-copy" onClick={handleCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? "Link copied to clipboard" : ""}
        </span>
      </div>
      <div className="research-footer-grid">
        {related.map((item) => (
          <Link key={item.slug} to={item.path} className="research-footer-card">
            <span className="research-footer-tag">{item.tag}</span>
            <span className="research-footer-title">{item.title}</span>
          </Link>
        ))}
      </div>
    </footer>
  );
}
