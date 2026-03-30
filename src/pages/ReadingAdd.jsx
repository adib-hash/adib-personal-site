import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ReadingAdd() {
  const [password, setPassword] = useState(
    () => localStorage.getItem("reading_admin_pw") || ""
  );
  const [authenticated, setAuthenticated] = useState(
    () => !!localStorage.getItem("reading_admin_pw")
  );
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }
  const [submitting, setSubmitting] = useState(false);
  const urlRef = useRef(null);
  const pwRef = useRef(null);

  useEffect(() => {
    if (authenticated && urlRef.current) {
      urlRef.current.focus();
    } else if (!authenticated && pwRef.current) {
      pwRef.current.focus();
    }
  }, [authenticated]);

  function handleAuth(e) {
    e.preventDefault();
    if (password.trim()) {
      localStorage.setItem("reading_admin_pw", password.trim());
      setAuthenticated(true);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!url.trim() || submitting) return;

    setSubmitting(true);
    setStatus(null);

    try {
      const res = await fetch("/api/reading-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          password: localStorage.getItem("reading_admin_pw"),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("reading_admin_pw");
          setAuthenticated(false);
          setPassword("");
          setStatus({ type: "error", message: "Wrong password." });
        } else {
          setStatus({ type: "error", message: data.error || "Failed to save." });
        }
        return;
      }

      setStatus({ type: "success", message: `Added: ${data.title}` });
      setUrl("");
      urlRef.current?.focus();

      // Auto-clear success message
      setTimeout(() => setStatus(null), 4000);
    } catch {
      setStatus({ type: "error", message: "Network error. Try again." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      style={{ maxWidth: 480 }}
    >
      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "36px",
          margin: "0 0 8px",
        }}
      >
        Add to Reading
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 32 }}>
        Paste a URL. Title and image are extracted automatically.
      </p>

      {!authenticated ? (
        <form onSubmit={handleAuth}>
          <label
            style={{
              display: "block",
              fontSize: 14,
              color: "var(--text-muted)",
              marginBottom: 8,
            }}
          >
            Password
          </label>
          <input
            ref={pwRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-heading)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: 12,
              padding: "10px 24px",
              fontSize: 14,
              fontWeight: 600,
              background: "var(--accent)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Continue
          </button>
        </form>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            ref={urlRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a URL..."
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px 16px",
              fontSize: 16,
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text-heading)",
              outline: "none",
              boxSizing: "border-box",
              opacity: submitting ? 0.6 : 1,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 12,
            }}
          >
            <button
              type="submit"
              disabled={submitting || !url.trim()}
              style={{
                padding: "10px 24px",
                fontSize: 14,
                fontWeight: 600,
                background: submitting ? "var(--text-muted)" : "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: submitting ? "wait" : "pointer",
              }}
            >
              {submitting ? "Saving..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("reading_admin_pw");
                setAuthenticated(false);
                setPassword("");
              }}
              style={{
                padding: "10px 16px",
                fontSize: 13,
                background: "transparent",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </form>
      )}

      {status && (
        <div
          style={{
            marginTop: 20,
            padding: "12px 16px",
            borderRadius: 8,
            fontSize: 14,
            background:
              status.type === "success"
                ? "rgba(107, 142, 90, 0.15)"
                : "rgba(220, 80, 80, 0.15)",
            color:
              status.type === "success" ? "#8abb78" : "#dc5050",
            border: `1px solid ${
              status.type === "success"
                ? "rgba(107, 142, 90, 0.3)"
                : "rgba(220, 80, 80, 0.3)"
            }`,
          }}
        >
          {status.message}
        </div>
      )}
    </motion.div>
  );
}
