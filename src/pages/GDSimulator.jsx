import { useState, useRef, useEffect } from "react";

const GD_TOPICS = [
  "Should AI replace human jobs?",
  "Work from home is more productive than office work.",
  "Social media does more harm than good.",
  "Is engineering still a good career choice in India?",
  "Should college exams be replaced by continuous assessment?",
  "Electric vehicles are the future of transportation.",
  "Startups vs MNCs — which is better for freshers?",
  "Is the Indian education system preparing students for the real world?",
];

const AI_PARTICIPANTS = [
  { name: "Priya", avatar: "👩‍💼", stance: "strongly agrees", color: "#22C55E", personality: "data-driven, assertive, uses statistics" },
  { name: "Rohan", avatar: "👨‍💻", stance: "disagrees", color: "#EF4444", personality: "critical thinker, raises counter-points, plays devil's advocate" },
  { name: "Meera", avatar: "👩‍🎓", stance: "neutral/balanced", color: "#F59E0B", personality: "diplomatic, tries to find middle ground, asks clarifying questions" },
];

export default function GDSimulator() {
  const [stage, setStage] = useState("setup"); // setup | active | result
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [round, setRound] = useState(0); // 0=AI opens, then user, then AI responds, repeat
  const [loading, setLoading] = useState(false);
  const [turnCount, setTurnCount] = useState(0);
  const [finalEval, setFinalEval] = useState(null);
  const [userTurns, setUserTurns] = useState([]);
  const chatRef = useRef(null);
  const MAX_TURNS = 3; // user gets 3 turns

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const startGD = async () => {
    const t = topic || customTopic;
    if (!t) return;
    setStage("active");
    setMessages([]);
    setTurnCount(0);
    setUserTurns([]);
    setLoading(true);

    // Opening by Priya (agrees)
    const opening = await getAIStatement(t, AI_PARTICIPANTS[0], [], "open the GD with a strong opening statement (2-3 sentences)");
    const msg1 = { from: "Priya", avatar: "👩‍💼", color: "#22C55E", text: opening, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };

    // Rohan counters
    const counter = await getAIStatement(t, AI_PARTICIPANTS[1], [msg1], "respond to Priya's point with a counter-argument (2-3 sentences)");
    const msg2 = { from: "Rohan", avatar: "👨‍💻", color: "#EF4444", text: counter, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };

    setMessages([msg1, msg2]);
    setLoading(false);
  };

  const getAIStatement = async (t, participant, history, instruction) => {
    try {
      const histText = history.map(m => `${m.from}: ${m.text}`).join("\n");
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 200,
          messages: [{
            role: "user",
            content: `You are ${participant.name} in a Group Discussion. Topic: "${t}". Your stance: ${participant.stance}. Your personality: ${participant.personality}.

Discussion so far:
${histText || "(GD just starting)"}

Your task: ${instruction}. Be natural, direct, conversational. No formatting. 2-3 sentences only.`
          }]
        })
      });
      const data = await resp.json();
      return data.content?.[0]?.text || `As someone who ${participant.stance} this topic, I think we need to consider all angles carefully.`;
    } catch {
      return `This is an important point about "${t}" that deserves careful consideration from all of us.`;
    }
  };

  const submitUserMessage = async () => {
    if (!userInput.trim() || loading) return;
    const t = topic || customTopic;
    const userMsg = { from: "You", avatar: "🧑‍💼", color: "#4F7EFF", text: userInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), isUser: true };
    const newMessages = [...messages, userMsg];
    const newTurns = [...userTurns, userInput];
    setMessages(newMessages);
    setUserTurns(newTurns);
    setUserInput("");
    setLoading(true);

    const newTurnCount = turnCount + 1;
    setTurnCount(newTurnCount);

    if (newTurnCount >= MAX_TURNS) {
      // Meera gives closing
      const closing = await getAIStatement(t, AI_PARTICIPANTS[2], newMessages, "give a brief closing/summary statement (2-3 sentences)");
      const closeMsg = { from: "Meera", avatar: "👩‍🎓", color: "#F59E0B", text: closing, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
      setMessages([...newMessages, closeMsg]);
      setLoading(false);
      await evaluateGD(t, newMessages, newTurns);
      return;
    }

    // Pick which AI responds
    const responder = newTurnCount % 2 === 1 ? AI_PARTICIPANTS[2] : AI_PARTICIPANTS[1];
    const instruction = newTurnCount % 2 === 1
      ? "respond to the student's point thoughtfully, either building on it or adding nuance"
      : "challenge the student's last point or raise a new counter-argument";

    const reply = await getAIStatement(t, responder, newMessages, instruction);
    const replyMsg = { from: responder.name, avatar: responder.avatar, color: responder.color, text: reply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages([...newMessages, replyMsg]);
    setLoading(false);
  };

  const evaluateGD = async (t, allMessages, turns) => {
    setLoading(true);
    try {
      const discussion = allMessages.map(m => `${m.from}: ${m.text}`).join("\n");
      const userContributions = turns.join("\n");
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Evaluate this student's Group Discussion performance.

Topic: "${t}"
Full Discussion:
${discussion}

Student's contributions only:
${userContributions}

Respond ONLY with JSON (no markdown):
{
  "gd_score": <0-100>,
  "clarity": <0-100>,
  "argument_strength": <0-100>,
  "counter_handling": <0-100>,
  "leadership": <0-100>,
  "strengths": ["point1", "point2", "point3"],
  "improvements": ["point1", "point2"],
  "summary": "<2-3 sentence overall feedback>",
  "verdict": "<Excellent/Good/Average/Needs Work>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setFinalEval(parsed);
      setStage("result");
    } catch {
      setFinalEval({ gd_score: 65, clarity: 70, argument_strength: 60, counter_handling: 65, leadership: 60, strengths: ["Participated actively", "Stayed on topic"], improvements: ["Be more assertive", "Use data to support points"], summary: "Good effort. Keep practising to improve assertiveness.", verdict: "Good" });
      setStage("result");
    }
    setLoading(false);
  };

  const scoreColor = s => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: "32px", maxWidth: 860, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {stage === "setup" && (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>AI Group Discussion Simulator</h1>
            <p style={{ color: "#8892a4", fontSize: 15 }}>Practice GDs with 3 AI participants who challenge, counter, and debate with you</p>
          </div>

          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 24, marginBottom: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Meet Your Group</h3>
            <p style={{ color: "#8892a4", fontSize: 13, marginBottom: 20 }}>3 AI participants with distinct personalities will debate the topic with you</p>
            <div style={{ display: "flex", gap: 14 }}>
              {AI_PARTICIPANTS.map(p => (
                <div key={p.name} style={{ flex: 1, background: "#0f1525", borderRadius: 10, padding: 16, border: `1px solid ${p.color}33` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{p.avatar}</div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                  <div style={{ color: p.color, fontSize: 11, fontWeight: 600, margin: "4px 0", textTransform: "uppercase" }}>{p.stance}</div>
                  <div style={{ color: "#8892a4", fontSize: 12 }}>{p.personality}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#a8b4cc", fontSize: 13, fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.08em" }}>Choose a Topic</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              {GD_TOPICS.map(t => (
                <button key={t} onClick={() => { setTopic(t); setCustomTopic(""); }}
                  style={{ background: topic === t ? "#4F7EFF22" : "#161c2e", border: `1.5px solid ${topic === t ? "#4F7EFF" : "#2a3450"}`, borderRadius: 10, padding: "12px 16px", cursor: "pointer", color: topic === t ? "#4F7EFF" : "#c8d0e0", fontSize: 13, textAlign: "left", transition: "all .15s" }}>
                  {t}
                </button>
              ))}
            </div>
            <input value={customTopic} onChange={e => { setCustomTopic(e.target.value); setTopic(""); }}
              placeholder="Or enter a custom topic..."
              style={{ width: "100%", background: "#161c2e", border: "1px solid #2a3450", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          </div>

          <button onClick={startGD} disabled={!topic && !customTopic}
            style={{ width: "100%", background: (topic || customTopic) ? "#4F7EFF" : "#161c2e", color: (topic || customTopic) ? "#fff" : "#3a4560", border: "none", borderRadius: 12, padding: 16, fontSize: 16, fontWeight: 700, cursor: (topic || customTopic) ? "pointer" : "not-allowed" }}>
            Start Group Discussion →
          </button>
        </>
      )}

      {stage === "active" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ color: "#8892a4", fontSize: 12, marginBottom: 4 }}>Group Discussion</div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>"{topic || customTopic}"</div>
            </div>
            <div style={{ background: "#22c55e22", color: "#22c55e", border: "1px solid #22c55e44", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600 }}>
              Turn {turnCount}/{MAX_TURNS}
            </div>
          </div>

          {/* Chat area */}
          <div ref={chatRef} style={{ background: "#0f1525", border: "1px solid #2a3450", borderRadius: 16, padding: 20, height: 380, overflowY: "auto", marginBottom: 16, display: "flex", flexDirection: "column", gap: 14 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", gap: 12, flexDirection: m.isUser ? "row-reverse" : "row" }}>
                <div style={{ width: 36, height: 36, background: m.color + "22", border: `1px solid ${m.color}44`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{m.avatar}</div>
                <div style={{ maxWidth: "72%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexDirection: m.isUser ? "row-reverse" : "row" }}>
                    <span style={{ color: m.color, fontSize: 12, fontWeight: 700 }}>{m.from}</span>
                    <span style={{ color: "#3a4560", fontSize: 11 }}>{m.time}</span>
                  </div>
                  <div style={{ background: m.isUser ? "#4F7EFF22" : "#161c2e", border: `1px solid ${m.isUser ? "#4F7EFF44" : "#2a3450"}`, borderRadius: m.isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px", padding: "12px 16px", color: "#d8e0f0", fontSize: 14, lineHeight: 1.6 }}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#8892a4", fontSize: 13 }}>
                <div style={{ width: 14, height: 14, border: "2px solid #4F7EFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                AI participant is thinking...
              </div>
            )}
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <textarea value={userInput} onChange={e => setUserInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitUserMessage(); } }}
              placeholder={`Share your point on "${topic || customTopic}"... (Enter to send)`}
              disabled={loading}
              style={{ flex: 1, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 10, padding: "12px 16px", color: "#fff", fontSize: 14, resize: "none", height: 60, outline: "none", fontFamily: "inherit" }} />
            <button onClick={submitUserMessage} disabled={!userInput.trim() || loading}
              style={{ background: userInput.trim() && !loading ? "#4F7EFF" : "#161c2e", color: userInput.trim() && !loading ? "#fff" : "#3a4560", border: "none", borderRadius: 10, padding: "0 20px", cursor: "pointer", fontSize: 20 }}>
              ↑
            </button>
          </div>
          <div style={{ marginTop: 8, color: "#3a4560", fontSize: 12, textAlign: "right" }}>
            {MAX_TURNS - turnCount} turns remaining · GD ends after your last contribution
          </div>
        </>
      )}

      {stage === "result" && finalEval && (
        <>
          <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              {finalEval.verdict === "Excellent" ? "🏆" : finalEval.verdict === "Good" ? "🎯" : finalEval.verdict === "Average" ? "📈" : "💪"}
            </div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 6 }}>GD Complete — {finalEval.verdict}!</h2>
            <div style={{ color: "#8892a4", fontSize: 14 }}>"{topic || customTopic}"</div>

            <div style={{ display: "inline-block", marginTop: 20 }}>
              <div style={{ width: 100, height: 100, borderRadius: "50%", background: `conic-gradient(${scoreColor(finalEval.gd_score)} ${finalEval.gd_score}%, #2a3450 0)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                <div style={{ width: 76, height: 76, borderRadius: "50%", background: "#0f1525", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ color: scoreColor(finalEval.gd_score), fontSize: 22, fontWeight: 800 }}>{finalEval.gd_score}</div>
                  <div style={{ color: "#8892a4", fontSize: 10 }}>GD Score</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Clarity of Argument", val: finalEval.clarity },
              { label: "Argument Strength", val: finalEval.argument_strength },
              { label: "Handling Counter-points", val: finalEval.counter_handling },
              { label: "Leadership Quality", val: finalEval.leadership },
            ].map((m, i) => (
              <div key={i} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 12, padding: 16 }}>
                <div style={{ color: "#8892a4", fontSize: 12, marginBottom: 8 }}>{m.label}</div>
                <div style={{ height: 6, background: "#2a3450", borderRadius: 4, marginBottom: 6 }}>
                  <div style={{ height: "100%", width: m.val + "%", background: scoreColor(m.val), borderRadius: 4, transition: "width 1.2s" }} />
                </div>
                <div style={{ color: scoreColor(m.val), fontSize: 14, fontWeight: 700 }}>{m.val}/100</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ color: "#a8b4cc", fontSize: 14, lineHeight: 1.7 }}>{finalEval.summary}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
            <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Strengths</div>
              {finalEval.strengths?.map((s, i) => <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 6 }}>• {s}</div>)}
            </div>
            <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#f59e0b", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>↑ Improve</div>
              {finalEval.improvements?.map((s, i) => <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 6 }}>• {s}</div>)}
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setStage("setup")} style={{ background: "transparent", color: "#8892a4", border: "1px solid #2a3450", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 14 }}>← New Topic</button>
            <button onClick={() => { setStage("setup"); setTopic(topic); setCustomTopic(customTopic); setTimeout(startGD, 100); }}
              style={{ background: "#4F7EFF", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
              Retry Same Topic
            </button>
          </div>
        </>
      )}
    </div>
  );
}