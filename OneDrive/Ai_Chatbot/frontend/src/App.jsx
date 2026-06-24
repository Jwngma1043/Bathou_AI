import { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./App.css";

const WELCOME = {
  role: "assistant",
  content: `कुलुम्बाइ! 🙏 Ang Bathou AI.
Bodo gwsan AI assistant nangou!

[English: Hello! I am Bathou AI, your Bodo language assistant. Ask me anything!]`
};

export default function App() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/chat", {
        message: input.trim()
      });

      const data = response.data;
      const botReply = `${data.bodo}\n\n[English: ${data.english}]`;

      setMessages(prev => [...prev, {
        role: "assistant",
        content: botReply
      }]);

    } catch (err) {
      console.error("Error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Cannot connect to backend. Make sure the server is running!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <span>🌿</span>
        <div>
          <h1>Bathou AI</h1>
          <p>Bodo Language Assistant</p>
        </div>
      </div>

      <div className="chat">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg assistant">
            <div className="bubble typing">
              <span/><span/><span/>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder='Try: "hello", "how are you", "thank you"'
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={!input.trim() || loading}>
          Send
        </button>
      </div>
    </div>
  );
}