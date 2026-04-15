import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { GripVertical, Pencil, Trash2, Check, X } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function getPassword() {
  return localStorage.getItem("reading_admin_pw") || "";
}

export default function ReadingAdd() {
  const [password, setPassword] = useState(getPassword);
  const [authenticated, setAuthenticated] = useState(() => !!getPassword());
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [deletingId, setDeletingId] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const urlRef = useRef(null);
  const pwRef = useRef(null);

  const fetchItems = useCallback(async () => {
    setLoadingItems(true);
    try {
      const res = await fetch("/api/reading?bust=" + Date.now());
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch {
      // silent
    } finally {
      setLoadingItems(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchItems();
      urlRef.current?.focus();
    } else {
      pwRef.current?.focus();
    }
  }, [authenticated, fetchItems]);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function handleAuth(e) {
    e.preventDefault();
    if (password.trim()) {
      localStorage.setItem("reading_admin_pw", password.trim());
      setAuthenticated(true);
    }
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!url.trim() || submitting) return;
    setSubmitting(true);
    setToast(null);

    try {
      const res = await fetch("/api/reading-add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: url.trim(),
          note: note.trim(),
          password: getPassword(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("reading_admin_pw");
          setAuthenticated(false);
          setPassword("");
          showToast("error", "Wrong password.");
        } else {
          showToast("error", data.error || "Failed to save.");
        }
        return;
      }

      showToast("success", `Added: ${data.title}`);
      setUrl("");
      setNote("");
      setItems((prev) => [data, ...prev]);
      urlRef.current?.focus();
    } catch {
      showToast("error", "Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditFields({
      title: item.title || "",
      author: item.author || "",
      note: item.note || "",
    });
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch("/api/reading-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          password: getPassword(),
          fields: editFields,
        }),
      });
      if (!res.ok) {
        showToast("error", "Failed to update.");
        return;
      }
      const updated = await res.json();
      setItems((prev) =>
        prev.map((it) => (it.id === editingId ? updated : it))
      );
      setEditingId(null);
      showToast("success", "Updated.");
    } catch {
      showToast("error", "Network error.");
    }
  }

  async function confirmDelete(id) {
    try {
      const res = await fetch("/api/reading-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, password: getPassword() }),
      });
      if (!res.ok) {
        showToast("error", "Failed to delete.");
        return;
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
      setDeletingId(null);
      showToast("success", "Deleted.");
    } catch {
      showToast("error", "Network error.");
    }
  }

  function handleDragStart(id) {
    setDragId(id);
  }

  function handleDragOver(e, id) {
    e.preventDefault();
    if (id !== dragId) setDragOverId(id);
  }

  function handleDragLeave() {
    setDragOverId(null);
  }

  async function handleDrop(targetId) {
    setDragOverId(null);
    if (!dragId || dragId === targetId) {
      setDragId(null);
      return;
    }

    const oldItems = [...items];
    const dragIdx = oldItems.findIndex((it) => it.id === dragId);
    const targetIdx = oldItems.findIndex((it) => it.id === targetId);
    if (dragIdx === -1 || targetIdx === -1) {
      setDragId(null);
      return;
    }

    // Move item in array
    const [moved] = oldItems.splice(dragIdx, 1);
    oldItems.splice(targetIdx, 0, moved);
    setItems(oldItems);
    setDragId(null);

    // Assign new scores: highest score = first item (newest)
    const now = Date.now();
    const order = oldItems.map((item, i) => ({
      id: item.id,
      score: now - i,
    }));

    try {
      await fetch("/api/reading-reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: getPassword(), order }),
      });
    } catch {
      // Revert on failure
      setItems(items);
      showToast("error", "Failed to reorder.");
    }
  }

  if (!authenticated) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={pageVariants}
        style={{ maxWidth: 480 }}
      >
        <h1 className="ra-h1" style={{ fontFamily: "var(--font-serif)", margin: "0 0 8px" }}>
          Manage Reading
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 32 }}>
          Admin access required.
        </p>
        <form onSubmit={handleAuth}>
          <label style={{ display: "block", fontSize: 14, color: "var(--text-muted)", marginBottom: 8 }}>
            Password
          </label>
          <input
            ref={pwRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="ra-input"
            style={inputStyle}
          />
          <button type="submit" className="ra-btn-primary" style={{ ...btnPrimary, marginTop: 12 }}>
            Continue
          </button>
        </form>
        {toast && <Toast toast={toast} />}
        <ReadingAddStyles />
      </motion.div>
    );
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={pageVariants}>
      <div className="ra-header">
        <h1 className="ra-h1" style={{ fontFamily: "var(--font-serif)", margin: 0 }}>
          Manage Reading
        </h1>
        <button
          onClick={() => {
            localStorage.removeItem("reading_admin_pw");
            setAuthenticated(false);
            setPassword("");
          }}
          style={btnGhost}
        >
          Logout
        </button>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 24 }}>
        Add, edit, reorder, and delete reading links.
      </p>

      {/* Add URL + note */}
      <form onSubmit={handleAdd} className="ra-add-form">
        <div className="ra-field">
          <label className="ra-label" htmlFor="ra-url-input">
            Link
          </label>
          <input
            id="ra-url-input"
            ref={urlRef}
            type="url"
            inputMode="url"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            disabled={submitting}
            className="ra-input"
            style={{ ...inputStyle, opacity: submitting ? 0.6 : 1 }}
          />
        </div>

        <div className="ra-field">
          <label className="ra-label" htmlFor="ra-note-input">
            Description <span style={{ opacity: 0.6 }}>(optional)</span>
          </label>
          <textarea
            id="ra-note-input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why I liked this..."
            disabled={submitting}
            rows={3}
            className="ra-input ra-textarea"
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: 88,
              fontFamily: "inherit",
              lineHeight: 1.5,
              opacity: submitting ? 0.6 : 1,
            }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting || !url.trim()}
          className="ra-btn-primary ra-submit"
          style={{
            ...btnPrimary,
            opacity: submitting || !url.trim() ? 0.5 : 1,
            cursor: submitting ? "wait" : "pointer",
          }}
        >
          {submitting ? "Saving..." : "Add link"}
        </button>
      </form>

      {toast && <Toast toast={toast} />}

      {/* Items list */}
      <h2 style={{ fontSize: 20, fontFamily: "var(--font-serif)", marginBottom: 16 }}>
        Links ({items.length})
      </h2>

      {loadingItems && (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const isEditing = editingId === item.id;
          const isDeleting = deletingId === item.id;
          const isDragOver = dragOverId === item.id;

          return (
            <div
              key={item.id}
              draggable={!isEditing}
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(item.id)}
              onDragEnd={() => { setDragId(null); setDragOverId(null); }}
              style={{
                background: "var(--card-bg)",
                border: `1px solid ${isDragOver ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 8,
                padding: "12px 16px",
                opacity: dragId === item.id ? 0.4 : 1,
                transition: "opacity 0.15s, border-color 0.15s",
              }}
            >
              {/* Main row */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <GripVertical
                  size={16}
                  style={{ color: "var(--text-muted)", cursor: "grab", flexShrink: 0, opacity: 0.5 }}
                />

                {item.ogImage ? (
                  <img
                    src={item.ogImage}
                    alt=""
                    style={{
                      width: 48,
                      height: 48,
                      objectFit: "cover",
                      borderRadius: 6,
                      flexShrink: 0,
                      background: "#1a1a1a",
                    }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 6,
                      background: "var(--accent-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      flexShrink: 0,
                    }}
                  >
                    {item.domain?.slice(0, 3)}
                  </div>
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 500,
                      color: "var(--text-heading)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                    {item.domain}
                    {item.author && ` · ${item.author}`}
                  </div>
                </div>

                {!isEditing && !isDeleting && (
                  <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                    <button
                      onClick={() => startEdit(item)}
                      style={btnIcon}
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => setDeletingId(item.id)}
                      style={btnIcon}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Delete confirmation */}
              {isDeleting && (
                <div
                  style={{
                    marginTop: 10,
                    padding: "10px 12px",
                    background: "rgba(220, 80, 80, 0.08)",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: 14, color: "#dc5050" }}>
                    Delete this link?
                  </span>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => confirmDelete(item.id)}
                      style={{
                        ...btnSmall,
                        background: "rgba(220, 80, 80, 0.2)",
                        color: "#dc5050",
                      }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      style={btnSmall}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {isEditing && (
                <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                  <EditField
                    label="Title"
                    value={editFields.title}
                    onChange={(v) => setEditFields((f) => ({ ...f, title: v }))}
                  />
                  <EditField
                    label="Author"
                    value={editFields.author}
                    onChange={(v) => setEditFields((f) => ({ ...f, author: v }))}
                    placeholder="Optional"
                  />
                  <EditField
                    label="Note"
                    value={editFields.note}
                    onChange={(v) => setEditFields((f) => ({ ...f, note: v }))}
                    placeholder="Why I liked this..."
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button onClick={saveEdit} style={btnPrimary}>
                      <Check size={14} style={{ marginRight: 4 }} /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} style={btnGhost}>
                      <X size={14} style={{ marginRight: 4 }} /> Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <ReadingAddStyles />
    </motion.div>
  );
}

function EditField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label
        style={{
          display: "block",
          fontSize: 12,
          color: "var(--text-muted)",
          marginBottom: 4,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="ra-input"
        style={{ ...inputStyle, padding: "10px 12px", fontSize: 16 }}
      />
    </div>
  );
}

function ReadingAddStyles() {
  return (
    <style>{`
      .ra-h1 {
        font-size: 36px;
      }
      .ra-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 8px;
      }
      .ra-add-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 40px;
        max-width: 640px;
      }
      .ra-field {
        display: flex;
        flex-direction: column;
      }
      .ra-label {
        display: block;
        font-size: 13px;
        color: var(--text-muted);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        font-weight: 500;
      }
      /* Force >=16px inputs to prevent iOS Safari auto-zoom on focus */
      .ra-input {
        font-size: 16px !important;
      }
      .ra-textarea {
        min-height: 88px;
      }
      .ra-submit {
        align-self: flex-start;
      }
      @media (max-width: 640px) {
        .ra-h1 {
          font-size: 28px;
          line-height: 1.15;
        }
        .ra-header {
          align-items: center;
        }
        .ra-add-form {
          gap: 18px;
        }
        .ra-input {
          padding: 14px 14px !important;
          border-radius: 10px !important;
        }
        .ra-textarea {
          min-height: 110px;
        }
        .ra-submit {
          width: 100%;
          justify-content: center;
          padding: 14px 20px !important;
          font-size: 15px !important;
          border-radius: 10px !important;
        }
      }
    `}</style>
  );
}

function Toast({ toast }) {
  return (
    <div
      style={{
        marginBottom: 20,
        padding: "12px 16px",
        borderRadius: 8,
        fontSize: 14,
        background:
          toast.type === "success"
            ? "rgba(107, 142, 90, 0.15)"
            : "rgba(220, 80, 80, 0.15)",
        color: toast.type === "success" ? "#8abb78" : "#dc5050",
        border: `1px solid ${
          toast.type === "success"
            ? "rgba(107, 142, 90, 0.3)"
            : "rgba(220, 80, 80, 0.3)"
        }`,
      }}
    >
      {toast.message}
    </div>
  );
}

// Shared styles
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  fontSize: 16,
  background: "var(--card-bg)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  color: "var(--text-heading)",
  outline: "none",
  boxSizing: "border-box",
};

const btnPrimary = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 20px",
  fontSize: 14,
  fontWeight: 600,
  background: "var(--accent)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
};

const btnGhost = {
  display: "inline-flex",
  alignItems: "center",
  padding: "8px 14px",
  fontSize: 13,
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  cursor: "pointer",
};

const btnSmall = {
  display: "inline-flex",
  alignItems: "center",
  padding: "6px 12px",
  fontSize: 13,
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid var(--border)",
  borderRadius: 6,
  cursor: "pointer",
};

const btnIcon = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 32,
  height: 32,
  background: "transparent",
  color: "var(--text-muted)",
  border: "1px solid transparent",
  borderRadius: 6,
  cursor: "pointer",
  transition: "all 0.15s",
};
