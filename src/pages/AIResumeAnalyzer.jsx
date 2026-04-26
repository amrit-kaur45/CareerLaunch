import { useState, useRef } from "react";

export default function AIResumeAnalyzer() {
  const [tab, setTab] = useState("score"); // score | match | cover
  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setResumeText(ev.target.result);
    reader.readAsText(file);
  };

  const analyzeResume = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1200,
          messages: [{
            role: "user",
            content: `You are an expert ATS (Applicant Tracking System) and resume evaluator. Analyze this resume and return ONLY a JSON object (no markdown):

RESUME TEXT:
${resumeText.slice(0, 3000)}

Return:
{
  "ats_score": <0-100>,
  "sections": {
    "contact": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"},
    "summary": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"},
    "education": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"},
    "experience": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"},
    "skills": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"},
    "projects": {"score": <0-100>, "feedback": "<1-2 sentences>", "status": "good|warn|missing"}
  },
  "missing_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "strong_keywords": ["kw1", "kw2", "kw3"],
  "top_improvements": ["improvement1", "improvement2", "improvement3"],
  "verdict": "<one sentence overall verdict>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult({ type: "score", data: parsed });
    } catch (e) {
      setResult({ type: "error", data: { ats_score: 62, verdict: "Parsing error — try with plain text resume." } });
    }
    setLoading(false);
  };

  const matchJD = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `Compare this resume against this job description. Return ONLY JSON (no markdown):

RESUME:
${resumeText.slice(0, 2000)}

JOB DESCRIPTION:
${jdText.slice(0, 1500)}

Return:
{
  "match_score": <0-100>,
  "matched_keywords": ["kw1", "kw2", "kw3", "kw4"],
  "missing_keywords": ["kw1", "kw2", "kw3", "kw4", "kw5"],
  "matched_requirements": ["req1", "req2", "req3"],
  "missing_requirements": ["req1", "req2", "req3"],
  "suggestions": ["action1", "action2", "action3"],
  "verdict": "<2 sentence summary of fit>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult({ type: "match", data: parsed });
    } catch {
      setResult({ type: "error", data: {} });
    }
    setLoading(false);
  };

  const generateCoverLetter = async () => {
    if (!resumeText.trim() || !jdText.trim()) return;
    setLoading(true);
    setCoverLetter("");
    try {
      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Write a professional, tailored cover letter for this candidate based on their resume and the job description. Keep it 3–4 short paragraphs. Make it genuine, not generic. End with a clear call to action.

RESUME:
${resumeText.slice(0, 2000)}

JOB DESCRIPTION:
${jdText.slice(0, 1200)}

Write the cover letter directly. No intro text.`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "";
      setCoverLetter(text);
    } catch {
      setCoverLetter("Could not generate cover letter. Please try again.");
    }
    setLoading(false);
  };

  const scoreColor = s => s >= 80 ? "#22c55e" : s >= 60 ? "#f59e0b" : "#ef4444";
  const statusIcon = s => s === "good" ? "✓" : s === "warn" ? "⚠" : "✗";
  const statusColor = s => s === "good" ? "#22c55e" : s === "warn" ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ padding: "32px", maxWidth: 900, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>AI Resume Analyser</h1>
        <p style={{ color: "#8892a4", fontSize: 15 }}>ATS score · JD match · AI cover letter — all in one place</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "#0f1525", border: "1px solid #2a3450", borderRadius: 12, padding: 4, marginBottom: 28, width: "fit-content" }}>
        {[
          { id: "score", label: "📊 ATS Score" },
          { id: "match", label: "🎯 JD Match" },
          { id: "cover", label: "✉️ Cover Letter" },
        ].map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setResult(null); setCoverLetter(""); }}
            style={{ background: tab === t.id ? "#161c2e" : "transparent", color: tab === t.id ? "#fff" : "#8892a4", border: `1px solid ${tab === t.id ? "#2a3450" : "transparent"}`, borderRadius: 8, padding: "9px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600, transition: "all .2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Resume input (always shown) */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <label style={{ color: "#a8b4cc", fontSize: 13, fontWeight: 600 }}>Resume Text / Paste your resume</label>
          <button onClick={() => fileRef.current?.click()} style={{ background: "#161c2e", border: "1px solid #2a3450", color: "#8892a4", borderRadius: 7, padding: "5px 12px", fontSize: 12, cursor: "pointer" }}>
            📄 Upload .txt file
          </button>
          <input ref={fileRef} type="file" accept=".txt,.md" style={{ display: "none" }} onChange={handleFile} />
        </div>
        <textarea value={resumeText} onChange={e => setResumeText(e.target.value)}
          placeholder="Paste your resume text here (or upload a .txt file above)..."
          style={{ width: "100%", height: 160, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 12, padding: 16, color: "#e2e8f0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
      </div>

      {/* JD input for match and cover */}
      {(tab === "match" || tab === "cover") && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: "#a8b4cc", fontSize: 13, fontWeight: 600, display: "block", marginBottom: 8 }}>Job Description</label>
          <textarea value={jdText} onChange={e => setJdText(e.target.value)}
            placeholder="Paste the Job Description here..."
            style={{ width: "100%", height: 130, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 12, padding: 16, color: "#e2e8f0", fontSize: 14, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
        </div>
      )}

      {/* Action button */}
      <button
        onClick={tab === "score" ? analyzeResume : tab === "match" ? matchJD : generateCoverLetter}
        disabled={loading || !resumeText.trim() || ((tab === "match" || tab === "cover") && !jdText.trim())}
        style={{ background: loading || !resumeText.trim() ? "#1e2840" : "#4F7EFF", color: loading || !resumeText.trim() ? "#3a4560" : "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 32, transition: "all .2s" }}>
        {loading ? "Analyzing with AI..." : tab === "score" ? "🔍 Analyse Resume" : tab === "match" ? "⚡ Match with JD" : "✉️ Generate Cover Letter"}
      </button>

      {loading && (
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ display: "inline-flex", gap: 10, alignItems: "center", color: "#8892a4", fontSize: 14 }}>
            <div style={{ width: 18, height: 18, border: "2px solid #4F7EFF", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            AI is analysing your resume...
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {/* ATS Score Result */}
      {result?.type === "score" && result.data && (
        <>
          <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
            <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a3450" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor(result.data.ats_score)} strokeWidth="3"
                  strokeDasharray={`${result.data.ats_score} 100`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: scoreColor(result.data.ats_score), fontSize: 22, fontWeight: 800 }}>{result.data.ats_score}</div>
                <div style={{ color: "#8892a4", fontSize: 10 }}>ATS Score</div>
              </div>
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 600, marginBottom: 6 }}>
                {result.data.ats_score >= 80 ? "🏆 Excellent Resume!" : result.data.ats_score >= 60 ? "🎯 Good — a few tweaks needed" : "📈 Needs Improvement"}
              </div>
              <div style={{ color: "#a8b4cc", fontSize: 14, lineHeight: 1.6 }}>{result.data.verdict}</div>
            </div>
          </div>

          {/* Section scores */}
          {result.data.sections && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
              {Object.entries(result.data.sections).map(([key, val]) => (
                <div key={key} style={{ background: "#161c2e", border: `1px solid ${statusColor(val.status)}33`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{ color: "#fff", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{key}</span>
                    <span style={{ color: statusColor(val.status), fontSize: 16 }}>{statusIcon(val.status)}</span>
                  </div>
                  <div style={{ height: 4, background: "#2a3450", borderRadius: 4, marginBottom: 8 }}>
                    <div style={{ height: "100%", width: val.score + "%", background: scoreColor(val.score), borderRadius: 4 }} />
                  </div>
                  <div style={{ color: "#8892a4", fontSize: 12, lineHeight: 1.5 }}>{val.feedback}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {result.data.missing_keywords?.length > 0 && (
              <div style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: 12, padding: 16 }}>
                <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>⚠ Missing Keywords</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.data.missing_keywords.map((k, i) => <span key={i} style={{ background: "#ef444422", color: "#ef4444", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>{k}</span>)}
                </div>
              </div>
            )}
            {result.data.strong_keywords?.length > 0 && (
              <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 12, padding: 16 }}>
                <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Strong Keywords</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {result.data.strong_keywords.map((k, i) => <span key={i} style={{ background: "#22c55e22", color: "#22c55e", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>{k}</span>)}
                </div>
              </div>
            )}
          </div>

          {result.data.top_improvements?.length > 0 && (
            <div style={{ marginTop: 16, background: "#4F7EFF11", border: "1px solid #4F7EFF33", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#4F7EFF", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💡 Top Improvements</div>
              {result.data.top_improvements.map((imp, i) => (
                <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 6 }}>→ {imp}</div>
              ))}
            </div>
          )}
        </>
      )}

      {/* JD Match Result */}
      {result?.type === "match" && result.data && (
        <>
          <div style={{ display: "flex", gap: 20, marginBottom: 24, alignItems: "center" }}>
            <div style={{ position: "relative", width: 110, height: 110, flexShrink: 0 }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#2a3450" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke={scoreColor(result.data.match_score)} strokeWidth="3"
                  strokeDasharray={`${result.data.match_score} 100`} strokeLinecap="round" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ color: scoreColor(result.data.match_score), fontSize: 22, fontWeight: 800 }}>{result.data.match_score}%</div>
                <div style={{ color: "#8892a4", fontSize: 10 }}>JD Match</div>
              </div>
            </div>
            <div style={{ color: "#a8b4cc", fontSize: 14, lineHeight: 1.7 }}>{result.data.verdict}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✓ Matched Keywords</div>
              {result.data.matched_keywords?.map((k, i) => <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 5 }}>✓ {k}</div>)}
            </div>
            <div style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>✗ Missing Keywords</div>
              {result.data.missing_keywords?.map((k, i) => <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 5 }}>✗ {k}</div>)}
            </div>
          </div>

          {result.data.suggestions?.length > 0 && (
            <div style={{ background: "#4F7EFF11", border: "1px solid #4F7EFF33", borderRadius: 12, padding: 16 }}>
              <div style={{ color: "#4F7EFF", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>💡 How to Improve Your Match</div>
              {result.data.suggestions.map((s, i) => <div key={i} style={{ color: "#a8b4cc", fontSize: 13, marginBottom: 6 }}>→ {s}</div>)}
            </div>
          )}
        </>
      )}

      {/* Cover Letter Result */}
      {coverLetter && (
        <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>✉️ Your Cover Letter Draft</div>
            <button onClick={() => { navigator.clipboard.writeText(coverLetter); }}
              style={{ background: "#4F7EFF22", color: "#4F7EFF", border: "1px solid #4F7EFF44", borderRadius: 7, padding: "6px 14px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
              Copy
            </button>
          </div>
          <div style={{ background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 8, padding: 12, marginBottom: 16, color: "#f59e0b", fontSize: 12 }}>
            ⚠️ This is a draft generated by AI. Please personalise it before sending — add specific examples, correct the name/date, and review tone.
          </div>
          <div style={{ color: "#c8d0e0", fontSize: 14, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{coverLetter}</div>
        </div>
      )}
    </div>
  );
}