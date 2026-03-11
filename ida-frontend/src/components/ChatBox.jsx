import { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
function ChatBox({ onSend, loading }) {

  const [question, setQuestion] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {

    if (!question.trim() || loading) return;

    onSend(question);
    setQuestion("");

    // Auto focus after sending
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="chatbox">

      <input
        ref={inputRef}
        type="text"
        placeholder="Ask about internal documentation..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
      />

    <button
      onClick={handleSubmit}
      disabled={loading}
      className="send-btn"
    >
      <ArrowRight size={24} color="#000000" strokeWidth={2.5} />
    </button>

    </div>
  );
}

export default ChatBox;