import { useState, useRef, useEffect } from "react";
import ChatBox from "../components/ChatBox";
import Message from "../components/Message";
import { askQuestion } from "../services/api";

// lucide icons
import {
  PanelLeft,
  PanelRight,
  Plus,
  History,
  FileText
} from "lucide-react";

function Dashboard() {

  /* ---------------- SESSIONS ---------------- */

  const [sessions, setSessions] = useState([
    { id: 1, title: "New Chat", messages: [] }
  ]);

  const [activeSession, setActiveSession] = useState(1);
  const [messages, setMessages] = useState([]);

  /* ---------------- PANEL STATES ---------------- */

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [ragOpen, setRagOpen] = useState(true);

  /* ---------------- RAG DATA ---------------- */

  const [sources, setSources] = useState([]);
  const [confidence, setConfidence] = useState(null);
  const [context, setContext] = useState([]);

  /* ---------------- CHAT STATE ---------------- */

  const [loading, setLoading] = useState(false);
  const chatAreaRef = useRef(null);

  /* ---------------- LOAD SESSION ---------------- */

  useEffect(() => {
    const session = sessions.find((s) => s.id === activeSession);
    if (session) setMessages(session.messages);
  }, [activeSession, sessions]);

  /* ---------------- CHAT SCROLL ---------------- */

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  /* ---------------- NEW CHAT ---------------- */

  const createNewChat = () => {

    const newId = Date.now();

    const newSession = {
      id: newId,
      title: "New Chat",
      messages: []
    };

    setSessions((prev) => [...prev, newSession]);
    setActiveSession(newId);
    setMessages([]);

    setSources([]);
    setConfidence(null);
    setContext([]);

  };

  /* ---------------- SEND MESSAGE ---------------- */

  const handleSend = async (question) => {

    if (loading) return;

    setLoading(true);

    const newMessage = {
      question,
      answer: "Loading..."
    };

    setMessages((prev) => {

      const updated = [...prev, newMessage];

      setSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === activeSession
            ? {
                ...s,
                messages: updated,
                title:
                  s.title === "New Chat"
                    ? question.slice(0, 25)
                    : s.title
              }
            : s
        )
      );

      return updated;
    });

    try {

      const response = await askQuestion(question);

      setMessages((prev) => {

        const updated = [...prev];
        updated[updated.length - 1].answer = response.answer;

        setSessions((prevSessions) =>
          prevSessions.map((s) =>
            s.id === activeSession
              ? { ...s, messages: updated }
              : s
          )
        );

        return updated;
      });

      if (response.sources) setSources(response.sources);
      if (response.confidence) setConfidence(response.confidence);
      if (response.context) setContext(response.context);

      setLoading(false);

    } catch (error) {

      setTimeout(() => {

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].answer =
            "Error contacting AI server.";
          return updated;
        });

        setLoading(false);

      }, 800);

    }
  };

  return (

    <div className="app-layout">

{/* ---------- LEFT RAIL ---------- */}

        <div className="left-rail">

          {/* Toggle Chat History */}
          <button
            className="rail-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title="Chat History"
          >
            <PanelLeft size={22} strokeWidth={2.2} />
          </button>

        </div>

      {/* ---------- SIDEBAR ---------- */}

      {sidebarOpen && (

        <div className="sidebar">

          <div className="brand">
            <h2>DocuMind</h2>
            <p>AI Knowledge Assistant</p>
          </div>

          <button
            className="new-chat-btn"
            onClick={createNewChat}
          >
            + New Chat
          </button>

          <p className="sidebar-title">
            <History size={14} /> Chat History
          </p>

          <ul className="sidebar-list">

            {sessions.map((session) => (

              <li
                key={session.id}
                className={
                  session.id === activeSession
                    ? "active-session"
                    : ""
                }
                onClick={() => setActiveSession(session.id)}
              >
                {session.title}
              </li>

            ))}

          </ul>

        </div>

      )}

      {/* ---------- CHAT ---------- */}

      <div className="chat-container">

        <div className="chat-header">
          <h1>DocuMind</h1>
        </div>

        <div
          className="chat-area"
          ref={chatAreaRef}
        >

          {messages.map((msg, index) => (
            <div key={index}>
              <Message role="user" text={msg.question} />
              <Message role="ai" text={msg.answer} />
            </div>
          ))}

        </div>

        <ChatBox
          onSend={handleSend}
          loading={loading}
        />

      </div>

      {/* ---------- RAG PANEL ---------- */}

      {ragOpen && (

        <div className="rag-panel">

          <h3>RAG Insights</h3>

          <h4>Sources</h4>

          <div className="source-list">

            {sources.length === 0 ? (
              <p>No sources yet</p>
            ) : (
              sources.map((src, i) => (

                <div key={i} className="source-card">

                  <div className="source-title">
                    📄 {src.doc}
                  </div>

                  <div className="source-meta">
                    Page {src.page}
                  </div>

                  <div className="source-bar">
                    <div
                      className="source-fill"
                      style={{ width: `${src.score * 100}%` }}
                    />
                  </div>

                </div>

              ))
            )}

          </div>

          <h4>Confidence</h4>

          <div className="confidence-bar">
            <div
              className="confidence-fill"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>

          <h4>Context Preview</h4>

          <div className="context-preview">

            {context.length === 0
              ? "No retrieved context yet."
              : context.map((c, i) => (
                  <p key={i}>{c}</p>
                ))
            }

          </div>

        </div>

      )}

      {/* ---------- RIGHT RAIL ---------- */}

      <div className="right-rail">

        <button
          className="rail-btn"
          onClick={() => setRagOpen(!ragOpen)}
        >
        <FileText size={22} strokeWidth={2.2} />
        </button>

      </div>

    </div>

  );
}

export default Dashboard;