import { useState } from "react";
import "./App.css";
import axios from "axios";
import carBg from "./assets/hello_extensions.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://ai-email-generator-1-3skg.onrender.com";

const TONES = [
  { label: "Auto", value: "" },
  { label: "Professional", value: "Professional" },
  { label: "Friendly", value: "Friendly" },
  { label: "Casual", value: "Casual" },
  { label: "Formal", value: "Formal" },
];

function App() {
  const [emailContent, setEmailContent] = useState("");
  const [tone, setTone] = useState("");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async () => {
    if (!emailContent.trim()) {
      setError("Enter the original email before generating a reply.");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedReply("");

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/email/generate`,
        { emailContent, tone },
        { headers: { "Content-Type": "application/json" } }
      );

      setGeneratedReply(
        typeof response.data === "string"
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );
    } catch (err) {
      console.error(err);

      if (err.response) {
        setError(
          err.response.data?.message ||
            "The server hit an error while generating the reply."
        );
      } else if (err.request) {
        setError(
          "Can't reach the backend. Make sure Spring Boot is running on port 8080."
        );
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="app-shell">
      <img className="app-bg" src={carBg} alt="" aria-hidden="true" />
      <div className="app-scrim" />

      <div className="app-content">
        <main className="console-panel">
          <div className="console-eyebrow">
            <span className="eyebrow-dot" />
            AI REPLY ENGINE
          </div>

          <h1 className="console-heading">
            Draft replies
            <br />
            at full throttle.
          </h1>
          <p className="console-sub">
            Paste the email you received. Pick a mode. Get a reply ready to send.
          </p>

          <div className="field-group">
            <label className="field-label" htmlFor="email-input">
              Original message // input
            </label>
            <textarea
              id="email-input"
              className="field-textarea"
              rows={7}
              placeholder="Paste the email you're replying to…"
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
            />
          </div>

          <div className="field-group">
            <span className="field-label">Reply tone // select mode</span>
            <div className="tone-grid" role="group" aria-label="Reply tone">
              {TONES.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  className={
                    "tone-pill" + (tone === t.value ? " tone-pill--active" : "")
                  }
                  onClick={() => setTone(t.value)}
                  aria-pressed={tone === t.value}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="generate-btn"
            disabled={loading || !emailContent.trim()}
            onClick={handleSubmit}
          >
            <span className="generate-btn__label">
              {loading ? "Generating…" : "Generate reply"}
            </span>
            <span className="generate-btn__gauge" aria-hidden="true">
              <span
                className={
                  "generate-btn__sweep" + (loading ? " is-active" : "")
                }
              />
            </span>
          </button>

          {error && (
            <div className="alert-strip" role="alert">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M12 3L22 20H2L12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 10V14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
              </svg>
              {error}
            </div>
          )}

          {generatedReply && (
            <div className="output-panel">
              <div className="output-header">
                <span className="field-label">Generated reply // output</span>
                <button
                  type="button"
                  className="copy-btn"
                  onClick={handleCopy}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <textarea
                className="output-text"
                rows={9}
                value={generatedReply}
                readOnly
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
