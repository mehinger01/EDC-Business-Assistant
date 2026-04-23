import { useState, useRef, useEffect } from "react";

const EDC_CONTEXT = `
You are a helpful assistant for the Ogemaw County Economic Development Corporation (EDC), located in West Branch, Michigan. Answer questions about the EDC's programs, services, and resources. Be friendly, concise, and direct. If you don't know something specific, point people to call (989) 345-1090 or visit ogemawedc.com.

Here is everything you know about the Ogemaw County EDC:

MISSION: To support, promote, enhance, and sustain economic development throughout Ogemaw County. Tagline: "Collaborate, Innovate, and Grow Ogemaw County."

CONTACT: Phone: (989) 345-1090 | Website: ogemawedc.com | Facebook: facebook.com/OgemawCoEDC | LinkedIn available

BOARD MEETINGS: Held on the 3rd Monday of each month (unless noted). All meetings are open to the public. Contact Penny Payea at ppayea@michworks4u.org to be added to the agenda. Meetings occasionally go "on the road" quarterly.

---

REVOLVING LOAN FUND (RLF):
- A gap financing tool for development and expansion of small businesses in Ogemaw County
- Fixed rate loans from a self-replenishing pool of money
- Bridges the gap between what borrowers can get from banks and what they actually need
- Typically a borrower gets 60-80% of project financing from other sources, and the RLF fills the gap
- Can be used for starting or sustaining a business
- Critical loans can help businesses add or retain jobs
- To apply: send completed forms to ppayea@michworks4u.org
- Application available on their website

---

BUSINESS DEVELOPMENT PROGRAMS & RESOURCES:

1. Going PRO Talent Fund - Michigan employers can apply for competitive training funds (at least $55 million available statewide). In 2023/24, Ogemaw County received over $139,000 in Going PRO funds.

2. Michigan Economic Development Corporation (MEDC) - Markets Michigan as a place to do business, assists businesses with growth strategies. Works with 100+ economic development partners statewide.

3. Michigan Small Business Development Center (SBDC) - Offers free expert assistance to entrepreneurs starting or growing a business.

4. Opportunity Zones - Ogemaw County has 2 designated Opportunity Zones. These incentivize long-term capital investments in low-income communities through capital gains tax incentives. Best benefits for investors holding 10+ years.

5. Michigan Works! Region 7B - Serves Arenac, Clare, Gladwin, Iosco, Ogemaw, and Roscommon counties. Helps job seekers, employers, and community partners. Helps recruit, hire, and retain qualified workers.

6. Northern Initiatives - A nonprofit CDFI providing loans and business expertise to startups and existing businesses that may not qualify for traditional bank loans.

7. APEX Accelerator (formerly PTAC) - Free assistance for businesses interested in selling to federal or state government. Federal government buys $500+ billion annually; Michigan's state portfolio is $11.6 billion+.

8. Ogemaw County Land Bank - Puts vacant/blighted properties back to productive use.

9. Consumer's Energy SizeUp Tool - Free market insights tool for small businesses to compare to competition, find customers, competitors, and suppliers.

---

FINANCIAL RESOURCES:

1. Capital Access Program (MEDC) - Helps small businesses access loans from banks. Over $180 million deployed, helping 250+ small businesses.

2. Michigan Economic Opportunity Fund - Loan program for women, veterans, and entrepreneurs of color who don't qualify for traditional bank loans.

3. Revitalization and Placemaking (RAP) Program - Gap financing for place-based infrastructure, real estate rehabilitation, historic structures, traditional downtowns.

---

WORKFORCE DEVELOPMENT:
- Done in partnership with Michigan Works! Region 7B
- County stats (2020): Population 20,898 | Labor Force 8,265 | New Hires 1,094
- Training grants available through: Kirtland Community College, Mid Michigan Community College, Michigan Works! Region 7B
- Job seekers: Pure Michigan Talent Connect at mitalent.org

---

TEAM:
- Penny Payea - Director (ppayea@michworks4u.org)
- Phil Durst - President (Michigan State University Extension)
- Rich Castle - Vice President (Consumers Energy)
- Ray Stover - Treasurer (MidMichigan Health)

Always be helpful and specific. Keep answers conversational and under 150 words unless more detail is genuinely needed.
`;

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

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(text) {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const next = [...messages, { role: "user", content: userMsg }];
    setMessages(next);
    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: EDC_CONTEXT,
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response.";
      setMessages([...next, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setLoading(false);
  }

  const empty = messages.length === 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#ffffff",
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      {/* Header */}
      <div style={{
        width: "100%",
        background: "#ffffff",
        borderBottom: `3px solid ${GREEN}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
        padding: "14px 24px",
        display: "flex",
        justifyContent: "center",
      }}>
        <div style={{ maxWidth: 720, width: "100%", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            background: GREEN,
            borderRadius: 5,
            padding: "7px 10px",
            lineHeight: 1,
            flexShrink: 0,
          }}>
            <div style={{ color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: 2.5, textAlign: "center" }}>EDC</div>
            <div style={{ height: 1, background: "rgba(255,255,255,0.35)", margin: "4px 0" }} />
            <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 7, letterSpacing: 1.2, textAlign: "center" }}>OGEMAW CO.</div>
          </div>
          <div>
            <div style={{ color: TEXT_DARK, fontSize: 16, fontWeight: 700 }}>
              Ogemaw County EDC
            </div>
            <div style={{ color: GREEN, fontSize: 12, marginTop: 2 }}>
              Collaborate, Innovate, and Grow Ogemaw County
            </div>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ color: GRAY, fontSize: 12 }}>(989) 345-1090</span>
            <a href="https://ogemawedc.com" style={{ color: GREEN, fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
              ogemawedc.com
            </a>
          </div>
        </div>
      </div>

      {/* Chat body */}
      <div style={{ width: "100%", maxWidth: 720, flex: 1, padding: "0 16px", display: "flex", flexDirection: "column" }}>

        {empty && (
          <div style={{ padding: "32px 0 24px" }}>
            <div style={{
              background: GREEN_LIGHT,
              border: `1px solid ${GREEN_MID}`,
              borderLeft: `4px solid ${GREEN}`,
              borderRadius: 8,
              padding: "20px 22px",
              marginBottom: 28,
            }}>
              <div style={{ color: TEXT_DARK, fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
                How can we help grow your business?
              </div>
              <div style={{ color: GRAY, fontSize: 14, lineHeight: 1.65 }}>
                Ask about loans, grants, workforce training, site selection, financial resources, and more.
                We support businesses and entrepreneurs throughout Ogemaw County.
              </div>
            </div>

            <div style={{ color: GRAY, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
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
                  onMouseEnter={e => { e.target.style.background = GREEN_LIGHT; e.target.style.borderColor = GREEN; }}
                  onMouseLeave={e => { e.target.style.background = "#fff"; e.target.style.borderColor = GRAY_BORDER; }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div style={{ paddingBottom: 12 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 14,
              marginTop: i === 0 ? 24 : 0,
            }}>
              {m.role === "assistant" && (
                <div style={{
                  width: 32, height: 32,
                  background: GREEN,
                  borderRadius: 5,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  marginRight: 10, flexShrink: 0, marginTop: 2,
                  lineHeight: 1,
                }}>
                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 1.5 }}>EDC</span>
                </div>
              )}
              <div style={{
                maxWidth: "78%",
                background: m.role === "user" ? GREEN : "#ffffff",
                border: m.role === "user" ? "none" : `1px solid ${GRAY_BORDER}`,
                borderRadius: m.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                padding: "11px 16px",
                color: m.role === "user" ? "#ffffff" : GRAY,
                fontSize: 14,
                lineHeight: 1.65,
                whiteSpace: "pre-wrap",
                boxShadow: m.role === "assistant" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
              }}>
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{
                width: 32, height: 32, background: GREEN, borderRadius: 5,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontSize: 9, fontWeight: 800, letterSpacing: 1.5 }}>EDC</span>
              </div>
              <div style={{
                background: "#fff",
                border: `1px solid ${GRAY_BORDER}`,
                borderRadius: "16px 16px 16px 4px",
                padding: "12px 18px",
                display: "flex", gap: 5, alignItems: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 7, height: 7, borderRadius: "50%", background: GREEN,
                    animation: "pulse 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{
        position: "sticky", bottom: 0, width: "100%",
        background: "#fff",
        borderTop: `1px solid ${GRAY_BORDER}`,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
        padding: "12px 16px",
        display: "flex", justifyContent: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 720 }}>
          <div style={{
            display: "flex", gap: 8,
            background: GRAY_LIGHT,
            border: `1px solid ${GRAY_BORDER}`,
            borderRadius: 8,
            padding: "7px 7px 7px 14px",
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
              placeholder="Ask about EDC programs and resources..."
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                color: TEXT_DARK, fontSize: 14, fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{
                background: input.trim() && !loading ? GREEN : "#c8d4cc",
                border: "none", borderRadius: 6,
                width: 36, height: 36, flexShrink: 0,
                cursor: input.trim() && !loading ? "pointer" : "default",
                color: "#fff", fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.12s",
              }}
            >↑</button>
          </div>
          <div style={{ textAlign: "center", color: "#b0bdb4", fontSize: 11, marginTop: 7 }}>
            Ogemaw County EDC · West Branch, MI · (989) 345-1090 · ogemawedc.com
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
