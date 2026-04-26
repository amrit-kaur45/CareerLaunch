import { useState, useRef, useEffect } from "react";

const interviewTypes = [
  { id: "technical", label: "Technical", icon: "💻", color: "#4F7EFF", desc: "DSA + CS Fundamentals" },
  { id: "hr", label: "HR Round", icon: "🤝", color: "#22C55E", desc: "Behavioural & Situational" },
  { id: "mixed", label: "Mixed", icon: "⚡", color: "#F59E0B", desc: "Technical + HR Combined" },
];

const companyProfiles = [
  { id: "product", label: "Product Startup", icon: "🚀", style: "Expect DSA-heavy, system design basics, product thinking" },
  { id: "service", label: "Service MNC", icon: "🏢", style: "Aptitude + basic coding + HR round" },
  { id: "banking", label: "Banking Tech", icon: "🏦", style: "SQL, data analysis, compliance awareness" },
  { id: "faang", label: "FAANG-style", icon: "🌟", style: "Hard DSA, system design, behavioral STAR method" },
];

const questionBank = {
  technical: [
    "Explain the difference between a stack and a queue with real-world examples.",
    "What is the time complexity of binary search? Explain why.",
    "Write pseudocode for reversing a linked list.",
    "What is the difference between TCP and UDP?",
    "Explain database normalization. What are 1NF, 2NF, 3NF?",
    "What is a deadlock in OS? How do you prevent it?",
    "Explain the concept of virtual memory.",
    "What is the difference between process and thread?",
    "What are SOLID principles? Give one example.",
    "Explain how HashMap works internally in Java/Python.",
  ],
  hr: [
    "Tell me about yourself and why you're interested in this role.",
    "Describe a time you faced a significant challenge. How did you handle it?",
    "Where do you see yourself in 5 years?",
    "What is your greatest strength and how has it helped you?",
    "Tell me about a time you worked in a team and there was conflict.",
    "Why should we hire you over other candidates?",
    "What do you know about our company?",
    "Describe a situation where you showed leadership.",
    "How do you handle pressure and tight deadlines?",
    "What motivates you to give your best work?",
  ],
  mixed: [
    "Tell me about yourself and a recent technical project you're proud of.",
    "Explain the difference between REST and GraphQL APIs.",
    "Describe a time you debugged a complex issue. What was your approach?",
    "What is Big O notation? Why does it matter?",
    "Tell me about a time you learned a new technology quickly.",
    "What is the CAP theorem in distributed systems?",
    "Describe how you would design a URL shortener.",
    "How do you handle code review feedback you disagree with?",
    "What's the difference between SQL and NoSQL databases?",
    "Why do you want to join this specific company?",
  ],
};

const modelAnswers = {
  "Explain the difference between a stack and a queue with real-world examples.": "A stack is LIFO (Last In First Out) — like a stack of plates or browser back button. A queue is FIFO (First In First Out) — like a ticket line or print queue. Stacks use push/pop, queues use enqueue/dequeue. Stacks are used in function call management; queues in BFS traversal.",
  "Tell me about yourself and why you're interested in this role.": "A strong answer covers: your background (1-2 sentences), your key technical skills, a highlight from a project/internship, and why this specific role/company excites you. Use the Present-Past-Future structure: current status → relevant experience → why this role aligns with your goals.",
  "What is the time complexity of binary search? Explain why.": "O(log n). Each comparison eliminates half the search space. If we start with n elements, after 1 step: n/2, after 2: n/4... after k steps: n/2^k = 1, so k = log₂(n). Works only on sorted arrays.",
};

export default function MockInterview() {
  const [stage, setStage] = useState("setup"); // setup | interview | result
  const [type, setType] = useState(null);
  const [company, setCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [inputMode, setInputMode] = useState("text"); // text | voice
  const [draft, setDraft] = useState("");
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const textareaRef = useRef(null);

  const startInterview = () => {
    if (!type || !company) return;
    const pool = questionBank[type.id];
    const picked = [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
    setQuestions(picked);
    setCurrent(0);
    setAnswers([]);
    setScores([]);
    setFeedback([]);
    setDraft("");
    setStage("interview");
  };

  const evaluateAnswer = async (question, answer) => {
    if (!answer.trim()) return { score: 0, feedback: "No answer provided.", modelAnswer: modelAnswers[question] || "A strong answer would address the key concepts clearly with examples." };
    setLoading(true);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an expert technical interviewer. Evaluate this interview answer.

Interview Type: ${type?.label}
Company Profile: ${company?.label} (${company?.style})
Question: "${question}"
Candidate's Answer: "${answer}"

Respond ONLY with a JSON object (no markdown):
{
  "score": <0-100>,
  "technical_accuracy": <0-100>,
  "communication": <0-100>,
  "confidence": <0-100>,
  "strengths": ["point1", "point2"],
  "improvements": ["point1", "point2"],
  "feedback": "<2-3 sentence summary>",
  "model_answer": "<ideal concise answer in 3-4 sentences>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.map(c => c.text || "").join("") || "{}";
      try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch { return { score: 65, technical_accuracy: 60, communication: 70, confidence: 65, strengths: ["Attempted the question"], improvements: ["Add more detail"], feedback: "Reasonable attempt. Try to be more structured.", model_answer: modelAnswers[question] || "A comprehensive answer would cover the key concepts with examples." }; }
    } catch {
      return { score: 60, technical_accuracy: 58, communication: 65, confidence: 60, strengths: ["Provided an answer"], improvements: ["More structure needed"], feedback: "Could not evaluate fully. Keep practising.", model_answer: modelAnswers[question] || "Review this topic for a stronger answer." };
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    const result = await evaluateAnswer(questions[current], draft);
    const newAnswers = [...answers, { question: questions[current], answer: draft }];
    const newFeedback = [...feedback, result];
    const newScores = [...scores, result.score || 60];
    setAnswers(newAnswers);
    setFeedback(newFeedback);
    setScores(newScores);
    setDraft("");
    if (current + 1 >= questions.length) {
      setStage("result");
    } else {
      setCurrent(c => c + 1);
    }
  };

  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice input not supported in this browser. Use Chrome for best results.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e) => {
        const transcript = Array.from(e.results).map(r => r[0].transcript).join("");
        setDraft(transcript);
      };
      rec.onend = () => setListening(false);
      rec.start();
      recognitionRef.current = rec;
      setListening(true);
    }
  };

  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const scoreColor = (s) => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: "32px", maxWidth: 860, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {stage === "setup" && (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>AI Mock Interview</h1>
            <p style={{ color: "#8892a4", fontSize: 15 }}>Simulate real interviews with AI evaluation on accuracy, communication & confidence</p>
          </div>

          {/* Interview type */}
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ color: "#a8b4cc", fontSize: 13, fontWeight: 600, marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Select Interview Type</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
              {interviewTypes.map(t => (
                <button key={t.id} onClick={() => setType(t)} style={{
                  background: type?.id === t.id ? t.color + "22" : "#161c2e",
                  border: `2px solid ${type?.id === t.id ? t.color : "#2a3450"}`,
                  borderRadius: 14, padding: 20, cursor: "pointer", textAlign: "left", transition: "all .2s"
                }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{t.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.label}</div>
                  <div style={{ color: "#8892a4", fontSize: 12 }}>{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Company profile */}
          <div style={{ marginBottom: 36 }}>
            <h3 style={{ color: "#a8b4cc", fontSize: 13, fontWeight: 600, marginBottom: 14, letterSpacing: "0.08em", textTransform: "uppercase" }}>Company Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {companyProfiles.map(c => (
                <button key={c.id} onClick={() => setCompany(c)} style={{
                  background: company?.id === c.id ? "#4F7EFF22" : "#161c2e",
                  border: `2px solid ${company?.id === c.id ? "#4F7EFF" : "#2a3450"}`,
                  borderRadius: 14, padding: 18, cursor: "pointer", textAlign: "left", transition: "all .2s",
                  display: "flex", alignItems: "flex-start", gap: 14
                }}>
                  <span style={{ fontSize: 28 }}>{c.icon}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.label}</div>
                    <div style={{ color: "#8892a4", fontSize: 12, lineHeight: 1.5 }}>{c.style}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button onClick={startInterview} disabled={!type || !company}
            style={{ width: "100%", background: type && company ? "#4F7EFF" : "#161c2e", color: type && company ? "#fff" : "#3a4560", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: type && company ? "pointer" : "not-allowed", transition: "all .2s" }}>
            {type && company ? `Start ${type.label} Interview for ${company.label} →` : "Select type and company profile to start"}
          </button>
        </>
      )}

      {stage === "interview" && (
        <>
          {/* Progress header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ color: "#8892a4", fontSize: 12, marginBottom: 4 }}>{type?.icon} {type?.label} · {company?.icon} {company?.label}</div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Question {current + 1} of {questions.length}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {questions.map((_, i) => (
                <div key={i} style={{ width: 32, height: 6, borderRadius: 4, background: i < current ? "#22c55e" : i === current ? "#4F7EFF" : "#2a3450" }} />
              ))}
            </div>
          </div>

          {/* Question */}
          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ background: "#4F7EFF22", color: "#4F7EFF", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>Q</div>
              <div style={{ color: "#e2e8f0", fontSize: 17, lineHeight: 1.7, fontWeight: 500 }}>{questions[current]}</div>
            </div>
          </div>

          {/* Input mode toggle */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            {["text", "voice"].map(m => (
              <button key={m} onClick={() => setInputMode(m)} style={{
                background: inputMode === m ? "#4F7EFF22" : "transparent",
                color: inputMode === m ? "#4F7EFF" : "#8892a4",
                border: `1px solid ${inputMode === m ? "#4F7EFF" : "#2a3450"}`,
                borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600, textTransform: "capitalize"
              }}>{m === "text" ? "⌨️ Text" : "🎙️ Voice"}</button>
            ))}
          </div>

          {/* Answer area */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder={inputMode === "voice" ? "Click 🎙️ to start speaking... your answer will appear here" : "Type your answer here. Be clear and structured — the AI will evaluate technical accuracy, communication quality, and confidence..."}
              style={{
                width: "100%", minHeight: 160, background: "#0f1525", border: "1px solid #2a3450",
                borderRadius: 12, padding: 18, color: "#e2e8f0", fontSize: 15, resize: "vertical",
                lineHeight: 1.7, outline: "none", fontFamily: "inherit"
              }}
            />
            {inputMode === "voice" && (
              <button onClick={toggleVoice} style={{
                position: "absolute", bottom: 14, right: 14,
                background: listening ? "#ef444422" : "#4F7EFF22",
                color: listening ? "#ef4444" : "#4F7EFF",
                border: `1px solid ${listening ? "#ef4444" : "#4F7EFF"}`,
                borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontSize: 13, fontWeight: 600
              }}>
                {listening ? "⏹ Stop" : "🎙️ Speak"}
              </button>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ color: "#8892a4", fontSize: 13 }}>
              {draft.length > 0 ? `${draft.split(" ").filter(w => w).length} words` : "Longer answers score higher on confidence"}
            </div>
            <button onClick={submitAnswer} disabled={!draft.trim() || loading}
              style={{
                background: draft.trim() && !loading ? "#4F7EFF" : "#161c2e",
                color: draft.trim() && !loading ? "#fff" : "#3a4560",
                border: "none", borderRadius: 10, padding: "12px 28px",
                cursor: draft.trim() && !loading ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 700
              }}>
              {loading ? "Evaluating..." : current + 1 === questions.length ? "Finish Interview →" : "Submit Answer →"}
            </button>
          </div>

          {loading && (
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <div style={{ display: "inline-flex", gap: 8, alignItems: "center", color: "#8892a4", fontSize: 14 }}>
                <div style={{ width: 16, height: 16, border: "2px solid #4F7EFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                AI is evaluating your answer...
              </div>
            </div>
          )}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </>
      )}

      {stage === "result" && (
        <>
          <div style={{ textAlign: "center", marginBottom: 36, paddingTop: 20 }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>{avgScore >= 80 ? "🏆" : avgScore >= 65 ? "🎯" : "📈"}</div>
            <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Interview Complete!</h2>
            <div style={{ color: "#8892a4", fontSize: 15 }}>{type?.label} Interview · {company?.label}</div>

            <div style={{ display: "inline-grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: "20px 40px", margin: "24px auto" }}>
              {[
                { label: "Overall Score", val: avgScore + "/100", col: scoreColor(avgScore) },
                { label: "Questions", val: feedback.length + "/6" },
                { label: "Avg Technical", val: Math.round(feedback.reduce((a, b) => a + (b.technical_accuracy || 60), 0) / feedback.length) + "%" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: s.col || "#fff" }}>{s.val}</div>
                  <div style={{ fontSize: 12, color: "#8892a4", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 32 }}>
            {scores.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: scoreColor(s), fontWeight: 700, marginBottom: 4 }}>{s}</div>
                <div style={{ height: 60, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 6, position: "relative" }}>
                  <div style={{ position: "absolute", bottom: 0, width: "100%", height: s + "%", background: scoreColor(s) + "44", borderRadius: 6, transition: "height 1s" }} />
                </div>
                <div style={{ fontSize: 10, color: "#8892a4", marginTop: 4 }}>Q{i + 1}</div>
              </div>
            ))}
          </div>

          {/* Detailed feedback */}
          <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Detailed Feedback</h3>
          {answers.map((a, i) => (
            <div key={i} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 24, marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ color: "#fff", fontSize: 15, fontWeight: 600, flex: 1, lineHeight: 1.5 }}>{a.question}</div>
                <div style={{ background: scoreColor(scores[i]) + "22", color: scoreColor(scores[i]), borderRadius: 8, padding: "4px 12px", fontSize: 14, fontWeight: 700, marginLeft: 16 }}>{scores[i]}/100</div>
              </div>

              {feedback[i] && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "Technical", val: feedback[i].technical_accuracy || 60 },
                      { label: "Communication", val: feedback[i].communication || 65 },
                      { label: "Confidence", val: feedback[i].confidence || 60 },
                    ].map((m, j) => (
                      <div key={j} style={{ background: "#0f1525", borderRadius: 8, padding: "10px 14px" }}>
                        <div style={{ color: "#8892a4", fontSize: 11, marginBottom: 6 }}>{m.label}</div>
                        <div style={{ height: 4, background: "#2a3450", borderRadius: 4 }}>
                          <div style={{ height: "100%", width: m.val + "%", background: scoreColor(m.val), borderRadius: 4 }} />
                        </div>
                        <div style={{ color: scoreColor(m.val), fontSize: 12, fontWeight: 700, marginTop: 4 }}>{m.val}%</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ color: "#a8b4cc", fontSize: 13, lineHeight: 1.6, marginBottom: 12, background: "#0f1525", borderRadius: 8, padding: 14 }}>
                    {feedback[i].feedback}
                  </div>

                  {feedback[i].strengths?.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                      {feedback[i].strengths.map((s, j) => (
                        <span key={j} style={{ background: "#22c55e22", color: "#22c55e", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>✓ {s}</span>
                      ))}
                    </div>
                  )}
                  {feedback[i].improvements?.length > 0 && (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                      {feedback[i].improvements.map((s, j) => (
                        <span key={j} style={{ background: "#f59e0b22", color: "#f59e0b", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>↑ {s}</span>
                      ))}
                    </div>
                  )}

                  <details style={{ cursor: "pointer" }}>
                    <summary style={{ color: "#4F7EFF", fontSize: 13, fontWeight: 600 }}>View Model Answer</summary>
                    <div style={{ marginTop: 10, color: "#a8b4cc", fontSize: 13, lineHeight: 1.7, background: "#4F7EFF11", borderRadius: 8, padding: 14, borderLeft: "3px solid #4F7EFF" }}>
                      {feedback[i].model_answer}
                    </div>
                  </details>
                </>
              )}
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <button onClick={() => setStage("setup")} style={{ background: "transparent", color: "#8892a4", border: "1px solid #2a3450", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 14 }}>← New Interview</button>
            <button onClick={() => { setStage("interview"); setCurrent(0); setAnswers([]); setScores([]); setFeedback([]); setDraft(""); }} style={{ background: "#4F7EFF", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Retry Same Setup</button>
          </div>
        </>
      )}
    </div>
  );
}