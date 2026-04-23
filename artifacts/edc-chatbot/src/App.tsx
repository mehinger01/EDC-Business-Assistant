import { useState, useRef, useEffect } from "react";

const SUGGESTED = [
  "How can the EDC help me start a business?",
  "Tell me about the Revolving Loan Fund",
  "What workforce training is available?",
  "Are there grants for hiring employees?",
  "What are Opportunity Zones?",
  "How do I sell to the government?",
];

const GREEN = "#4a7c59";
const GREEN_LIGHT = "#edf4f0";
const GREEN_MID = "#c8dfd0";
const GRAY = "#4a5568";
const GRAY_LIGHT = "#f7f8f7";
const GRAY_BORDER = "#e2e8e2";
const TEXT_DARK = "#1a2e1f";

type Message = { role: "user" | "assistant"; content: string };

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text?: string) {
    const userMsg = text ?? input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const next: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.reply ?? "Sorry, I couldn't get a response.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: "Something went wrong. Please try again or call (989) 345-1090.",
        },
      ]);
    }
    setLoading(false);
  }

  const empty = messages.length === 0;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          width: "100%",
          background: "#ffffff",
          borderBottom: `3px solid ${GREEN}`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          padding: "14px 24px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              background: GREEN,
              borderRadius: 5,
              padding: "7px 10px",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: 2.5,
                textAlign: "center",
              }}
            >
              EDC
            </div>
            <div
              style={{
                height: 1,
                background: "rgba(255,255,255,0.35)",
                margin: "4px 0",
              }}
            />
            <div
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 7,
                letterSpacing: 1.2,
                textAlign: "center",
              }}
            >
              OGEMAW CO.
            </div>
          </div>
          <div>
            <button
              onClick={() => { setMessages([]); setInput(""); }}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ color: TEXT_DARK, fontSize: 16, fontWeight: 700 }}>
                Ogemaw County EDC
              </div>
              <div style={{ color: GREEN, fontSize: 12, marginTop: 2 }}>
                Collaborate, Innovate, and Grow Ogemaw County
              </div>
            </button>
          </div>
          <div
            style={{
              marginLeft: "auto",
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <span style={{ color: GRAY, fontSize: 12 }}>(989) 345-1090</span>
            <a
              href="https://ogemawedc.com"
              style={{
                color: GREEN,
                fontSize: 11,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ogemawedc.com
            </a>
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          flex: 1,
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {empty && (
          <div style={{ padding: "32px 0 24px" }}>
            <div
              style={{
                background: GREEN_LIGHT,
                border: `1px solid ${GREEN_MID}`,
                borderLeft: `4px solid ${GREEN}`,
                borderRadius: 8,
                padding: "20px 22px",
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  color: TEXT_DARK,
                  fontSize: 17,
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                How can we help grow your business?
              </div>
              <div
                style={{ color: GRAY, fontSize: 14, lineHeight: 1.65 }}
              >
                Ask about loans, grants, workforce training, site selection,
                financial resources, and more. We support businesses and
                entrepreneurs throughout Ogemaw County.
              </div>
            </div>

            <div
              style={{
                color: GRAY,
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 10,
              }}
            >
              Common Questions
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  style={{
                    background: "#fff",
                    border: `1px solid ${GRAY_BORDER}`,
                    borderRadius: 6,
                    padding: "8px 14px",
                    color: GREEN,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.12s",
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.background =
                      GREEN_LIGHT;
                    (e.target as HTMLButtonElement).style.borderColor = GREEN;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.background = "#fff";
                    (e.target as HTMLButtonElement).style.borderColor =
                      GRAY_BORDER;
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ paddingBottom: 12 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 14,
                marginTop: i === 0 ? 24 : 0,
              }}
            >
              {m.role === "assistant" && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: GREEN,
                    borderRadius: 5,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                    flexShrink: 0,
                    marginTop: 2,
                    lineHeight: 1,
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 800,
                      letterSpacing: 1.5,
                    }}
                  >
                    EDC
                  </span>
                </div>
              )}
              <div
                style={{
                  maxWidth: "78%",
                  background: m.role === "user" ? GREEN : "#ffffff",
                  border:
                    m.role === "user" ? "none" : `1px solid ${GRAY_BORDER}`,
                  borderRadius:
                    m.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  padding: "11px 16px",
                  color: m.role === "user" ? "#ffffff" : GRAY,
                  fontSize: 14,
                  lineHeight: 1.65,
                  whiteSpace: "pre-wrap",
                  boxShadow:
                    m.role === "assistant"
                      ? "0 1px 4px rgba(0,0,0,0.06)"
                      : "none",
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  background: GREEN,
                  borderRadius: 5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 800,
                    letterSpacing: 1.5,
                  }}
                >
                  EDC
                </span>
              </div>
              <div
                style={{
                  background: "#fff",
                  border: `1px solid ${GRAY_BORDER}`,
                  borderRadius: "16px 16px 16px 4px",
                  padding: "12px 18px",
                  display: "flex",
                  gap: 5,
                  alignItems: "center",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: GREEN,
                      animation: "pulse 1.2s ease-in-out infinite",
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          position: "sticky",
          bottom: 0,
          width: "100%",
          background: "#fff",
          borderTop: `1px solid ${GRAY_BORDER}`,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
          padding: "12px 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 720 }}>
          <div
            style={{
              display: "flex",
              gap: 8,
              background: GRAY_LIGHT,
              border: `1px solid ${GRAY_BORDER}`,
              borderRadius: 8,
              padding: "7px 7px 7px 14px",
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && send()
              }
              placeholder="Ask about EDC programs and resources..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: TEXT_DARK,
                fontSize: 14,
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? GREEN : "#c8d4cc",
                border: "none",
                borderRadius: 6,
                width: 36,
                height: 36,
                flexShrink: 0,
                cursor: input.trim() && !loading ? "pointer" : "default",
                color: "#fff",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.12s",
              }}
            >
              ↑
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              color: "#b0bdb4",
              fontSize: 11,
              marginTop: 7,
            }}
          >
            Ogemaw County EDC · West Branch, MI · (989) 345-1090 ·
            ogemawedc.com
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
