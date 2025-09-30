import React, { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * App - Main entry point for the Ocean Professional themed FAQ UI.
 * Provides:
 * - Header with brand and simple navigation
 * - Main chat interface to ask questions and display responses from backend
 * - Side panel for related questions (via optional /api/search)
 * - Footer with minimal links
 */
function App() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I’m your AI FAQ Assistant. Ask me anything about this product or project. I’ll search the knowledge base and provide a clear answer.",
    },
  ]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" }); // idle | loading | success | error

  const scrollRef = useRef(null);

  // Automatically scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Compute backend base URL; allow overriding via env (request ops to set in .env)
  const apiBase = useMemo(() => {
    // Allow proxy or same-origin; if REACT_APP_BACKEND_URL is provided, use it.
    // NOTE: Ask user to provide REACT_APP_BACKEND_URL in environment for cross-origin deployments.
    const env = process.env.REACT_APP_BACKEND_URL;
    if (env && typeof env === "string" && env.trim().length > 0) {
      return env.replace(/\/$/, "");
    }
    // default to same origin
    return "";
  }, []);

  // PUBLIC_INTERFACE
  async function handleAsk(e) {
    e?.preventDefault?.();
    const q = question.trim();
    if (!q) return;

    // Optimistic add user message
    const userMsg = { role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);
    setQuestion("");
    setLoading(true);
    setStatus({ type: "loading", message: "Getting answer..." });

    try {
      const res = await fetch(`${apiBase}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
      }
      const data = await res.json();
      const answer =
        data?.answer ??
        data?.result ??
        "I couldn't parse the answer from the backend response.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: String(answer) },
      ]);
      setStatus({ type: "success", message: "Answer received" });

      // fire and forget: search related
      fetchRelated(q).catch(() => {});
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        message:
          "There was a problem getting the answer. Please try again in a moment.",
      });
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I had trouble retrieving the answer. You can try again.",
        },
      ]);
    } finally {
      setLoading(false);
      // Reset status message after a short delay
      setTimeout(() => setStatus({ type: "idle", message: "" }), 1400);
    }
  }

  // PUBLIC_INTERFACE
  async function fetchRelated(q) {
    try {
      const res = await fetch(`${apiBase}/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) return;
      const data = await res.json();
      // Accept arrays like [{question,text,score}] or simple strings
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      const normalized = items
        .map((it) => {
          if (typeof it === "string") return { title: it, query: it };
          const title = it?.title || it?.question || it?.text || "";
          return { title: String(title), query: String(title) };
        })
        .filter((x) => x.title.trim().length > 0)
        .slice(0, 10);
      setRelated(normalized);
    } catch {
      // ignore optional search errors
    }
  }

  // Allow clicking a related question to auto-ask it
  function handleRelatedClick(item) {
    setQuestion(item.query);
    // queue a tiny delay so state updates then submit
    setTimeout(() => {
      handleAsk();
    }, 0);
  }

  const loadingBadge =
    status.type === "loading" ? (
      <span className="badge loading">
        <span className="dot" />
        Loading
      </span>
    ) : status.type === "success" ? (
      <span className="badge success">Answer ready</span>
    ) : status.type === "error" ? (
      <span className="badge error">Error</span>
    ) : null;

  return (
    <div className="app-shell">
      <header className="header" role="banner">
        <div className="header-inner">
          <div className="brand" aria-label="AI FAQ Assistant">
            <div className="brand-mark" />
            <div className="brand-name">AI FAQ Assistant</div>
          </div>
          <nav className="nav" aria-label="Primary">
            <a href="#faq">FAQ</a>
            <a href="#docs">Docs</a>
            <a href="#support">Support</a>
          </nav>
          <div className="actions">
            <button
              type="button"
              className="btn"
              onClick={() => window.location.reload()}
            >
              Refresh
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setMessages([
                  {
                    role: "assistant",
                    content:
                      "Hi! I’m your AI FAQ Assistant. Ask me anything about this product or project. I’ll search the knowledge base and provide a clear answer.",
                  },
                ]);
                setRelated([]);
                setQuestion("");
                setStatus({ type: "idle", message: "" });
              }}
            >
              New chat
            </button>
          </div>
        </div>
      </header>

      <main className="main" role="main">
        <section className="card" aria-label="FAQ chat">
          <div className="card-header">
            <h2 className="card-title">Ask the Knowledge Base</h2>
            <p className="card-subtitle">
              Type a question below. We’ll retrieve the most relevant
              information and give you a concise answer.
            </p>
          </div>

          <div className="messages" ref={scrollRef}>
            {messages.map((m, idx) => (
              <Message key={idx} role={m.role} content={m.content} />
            ))}
          </div>

          <form className="composer" onSubmit={handleAsk} aria-label="Ask form">
            <input
              className="input"
              type="text"
              name="question"
              placeholder="Ask a question about the docs, product, or project..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              aria-label="Your question"
              disabled={loading}
            />
            <button
              className="btn btn-primary send-btn"
              type="submit"
              disabled={loading || question.trim().length === 0}
              aria-busy={loading}
            >
              {loading ? "Asking..." : "Ask"}
            </button>
          </form>

          <div style={{ padding: "8px 16px 16px" }}>{loadingBadge}</div>
          {status.type === "error" && status.message && (
            <div style={{ padding: "0 16px 16px", color: "#7f1d1d" }}>
              {status.message}
            </div>
          )}
        </section>

        <aside className="sidebar" aria-label="Related questions">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Related questions</h3>
            <span className="badge dot">AI</span>
          </div>
          <div className="sidebar-list">
            {related.length === 0 ? (
              <div className="sidebar-item" style={{ cursor: "default" }}>
                No related questions yet. Ask something to see suggestions.
              </div>
            ) : (
              related.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sidebar-item"
                  onClick={() => handleRelatedClick(item)}
                >
                  {item.title}
                </button>
              ))
            )}
          </div>
        </aside>
      </main>

      <footer className="footer" role="contentinfo">
        <div className="footer-inner">
          <div>© {new Date().getFullYear()} AI FAQ Assistant</div>
          <div>
            <a href="#privacy">Privacy</a> · <a href="#terms">Terms</a> ·{" "}
            <a href="#contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Message - Render a chat message bubble with role-aware styling.
 */
function Message({ role, content }) {
  const isUser = role === "user";
  const isAssistant = role !== "user";
  const initials = isUser ? "U" : "A";
  return (
    <div className={`msg ${isUser ? "user" : "assistant"}`}>
      <div className="avatar" aria-hidden="true">
        {initials}
      </div>
      <div className="bubble" role="article">
        {String(content)}
      </div>
    </div>
  );
}

export default App;
