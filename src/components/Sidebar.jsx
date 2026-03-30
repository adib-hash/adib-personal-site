import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Home, FolderOpen, PenLine, BookOpen, Menu, X } from "lucide-react";

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
        <Link to="/" className="sidebar-logo" onClick={() => setOpen(false)}>
          AC
        </Link>
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

        {open && (
          <button
            className="hamburger"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            style={{ position: "absolute", top: 16, right: 16, left: "auto" }}
          >
            <X />
          </button>
        )}
      </nav>
    </>
  );
}
