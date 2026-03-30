import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Home, FolderOpen, PenLine, BookOpen, Menu, X } from "lucide-react";

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/writing", label: "Writing", icon: PenLine },
  { to: "/reading", label: "Reading", icon: BookOpen },
];

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="hamburger"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <Menu />
      </button>

      <div
        className={`sidebar-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      <nav className={`sidebar ${open ? "open" : ""}`}>
        {open && (
          <button
            className="sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        )}

        <Link to="/" className="sidebar-monogram" onClick={() => setOpen(false)}>
          AC
        </Link>

        <div className="sidebar-nav-links">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <a
            href="https://www.linkedin.com/in/adib-choudhury-26b282b8"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-social"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
      </nav>
    </>
  );
}
