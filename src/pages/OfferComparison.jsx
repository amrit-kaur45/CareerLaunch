import { useState } from "react";

const EMPTY_OFFER = { company: "", role: "", ctc: "", location: "", bond: "", remote: "Hybrid", perks: "", joiningDate: "" };

export default function OfferComparison() {
  const [offers, setOffers] = useState([{ ...EMPTY_OFFER }, { ...EMPTY_OFFER }]);
  const [aiSummary, setAiSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const updateOffer = (i, field, val) => {
    setOffers(prev => prev.map((o, idx) => idx === i ? { ...o, [field]: val } : o));
    setAnalyzed(false);
    setAiSummary("");
  };

  const addOffer = () => setOffers(prev => [...prev, { ...EMPTY_OFFER }]);
  const removeOffer = (i) => setOffers(prev => prev.filter((_, idx) => idx !== i));

  const validOffers = offers.filter(o => o.company && o.ctc);

  const analyze = async () => {
    if (validOffers.length < 2) return;
    setLoading(true);
    try {
      const offersText = validOffers.map((o, i) =>
        `Offer ${i + 1}: ${o.company} — ${o.role || "SDE"}, CTC: ${o.ctc} LPA, Location: ${o.location}, Bond: ${o.bond || "None"}, Work Mode: ${o.remote}, Perks: ${o.perks || "Standard"}, Joining: ${o.joiningDate || "TBD"}`
      ).join("\n");

      const resp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 800,
          messages: [{
            role: "user",
            content: `Compare these job offers for a fresh engineering graduate and give neutral, balanced advice:

${offersText}

Respond ONLY with JSON (no markdown):
{
  "best_for_growth": "<company name and 1 sentence why>",
  "best_for_money": "<company name and 1 sentence why>",
  "best_for_worklife": "<company name and 1 sentence why>",
  "overall_recommendation": "<company name> for most candidates because <reason>",
  "offer_insights": [
    {"company": "<name>", "pros": ["pro1","pro2","pro3"], "cons": ["con1","con2"], "verdict": "<Strong/Good/Average/Risky>"}
  ],
  "summary": "<3-4 sentence neutral overall comparison>",
  "watch_out": "<1 key risk or caveat to consider>"
}`
          }]
        })
      });
      const data = await resp.json();
      const text = data.content?.[0]?.text || "{}";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setAiSummary(parsed);
      setAnalyzed(true);
    } catch (e) {
      setAiSummary({ summary: "Could not analyze. Please check your inputs and try again.", offer_insights: [] });
      setAnalyzed(true);
    }
    setLoading(false);
  };

  const verdictColor = v => ({ Strong: "#22c55e", Good: "#4F7EFF", Average: "#f59e0b", Risky: "#ef4444" }[v] || "#8892a4");

  const maxCTC = Math.max(...validOffers.map(o => parseFloat(o.ctc) || 0), 1);

  return (
    <div style={{ padding: "32px", maxWidth: 1000, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Offer Comparison Tool</h1>
        <p style={{ color: "#8892a4", fontSize: 15 }}>Compare multiple job offers side-by-side — AI highlights what matters for your priorities</p>
      </div>

      {/* Offer cards */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${offers.length}, 1fr)`, gap: 16, marginBottom: 20, overflowX: "auto" }}>
        {offers.map((offer, i) => (
          <div key={i} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 20, minWidth: 260 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ background: "#4F7EFF22", color: "#4F7EFF", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>Offer {i + 1}</div>
              {offers.length > 2 && <button onClick={() => removeOffer(i)} style={{ background: "transparent", border: "none", color: "#8892a4", cursor: "pointer", fontSize: 18 }}>×</button>}
            </div>

            {[
              { label: "Company Name *", field: "company", placeholder: "e.g. Google", type: "text" },
              { label: "Role", field: "role", placeholder: "e.g. Software Engineer", type: "text" },
              { label: "CTC (LPA) *", field: "ctc", placeholder: "e.g. 12.5", type: "number" },
              { label: "Location", field: "location", placeholder: "e.g. Bangalore", type: "text" },
              { label: "Bond (months)", field: "bond", placeholder: "e.g. 12 or None", type: "text" },
              { label: "Perks / Benefits", field: "perks", placeholder: "Health, Stocks, Food...", type: "text" },
              { label: "Joining Date", field: "joiningDate", placeholder: "", type: "date" },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: 12 }}>
                <label style={{ color: "#8892a4", fontSize: 11, display: "block", marginBottom: 4, fontWeight: 600 }}>{f.label}</label>
                <input type={f.type} value={offer[f.field]} onChange={e => updateOffer(i, f.field, e.target.value)} placeholder={f.placeholder}
                  style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
              </div>
            ))}

            <div style={{ marginBottom: 12 }}>
              <label style={{ color: "#8892a4", fontSize: 11, display: "block", marginBottom: 4, fontWeight: 600 }}>Work Mode</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["Remote", "Hybrid", "On-site"].map(m => (
                  <button key={m} onClick={() => updateOffer(i, "remote", m)}
                    style={{ flex: 1, background: offer.remote === m ? "#4F7EFF22" : "transparent", color: offer.remote === m ? "#4F7EFF" : "#8892a4", border: `1px solid ${offer.remote === m ? "#4F7EFF" : "#2a3450"}`, borderRadius: 6, padding: "6px 4px", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
        {offers.length < 4 && (
          <button onClick={addOffer} style={{ background: "transparent", color: "#8892a4", border: "1px dashed #2a3450", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14 }}>
            + Add Another Offer
          </button>
        )}
        <button onClick={analyze} disabled={validOffers.length < 2 || loading}
          style={{ background: validOffers.length >= 2 && !loading ? "#4F7EFF" : "#161c2e", color: validOffers.length >= 2 && !loading ? "#fff" : "#3a4560", border: "none", borderRadius: 10, padding: "10px 28px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>
          {loading ? "Analyzing..." : "⚡ Compare with AI"}
        </button>
      </div>

      {/* Visual comparison */}
      {validOffers.length >= 2 && (
        <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 600, marginBottom: 20 }}>CTC Comparison</h3>
          <div style={{ display: "flex", gap: 20, alignItems: "flex-end", height: 120 }}>
            {validOffers.map((o, i) => {
              const pct = ((parseFloat(o.ctc) || 0) / maxCTC) * 100;
              const colors = ["#4F7EFF", "#22C55E", "#F59E0B", "#EF4444"];
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ color: colors[i], fontSize: 14, fontWeight: 700 }}>{o.ctc} LPA</div>
                  <div style={{ width: "100%", height: pct + "%", background: colors[i] + "33", border: `1px solid ${colors[i]}`, borderRadius: "6px 6px 0 0", minHeight: 4 }} />
                  <div style={{ color: "#c8d0e0", fontSize: 12, fontWeight: 600, textAlign: "center" }}>{o.company || `Offer ${i + 1}`}</div>
                  <div style={{ color: "#8892a4", fontSize: 11 }}>{o.remote}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {validOffers.length >= 2 && (
        <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 0, marginBottom: 24, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#0f1525" }}>
                <th style={{ padding: "14px 20px", color: "#8892a4", fontSize: 12, fontWeight: 600, textAlign: "left", borderBottom: "1px solid #2a3450" }}>Parameter</th>
                {validOffers.map((o, i) => (
                  <th key={i} style={{ padding: "14px 16px", color: "#fff", fontSize: 13, fontWeight: 700, textAlign: "center", borderBottom: "1px solid #2a3450" }}>{o.company || `Offer ${i + 1}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: "💰 CTC", key: "ctc", suffix: " LPA", best: "max" },
                { label: "📍 Location", key: "location" },
                { label: "🏠 Work Mode", key: "remote" },
                { label: "⛓️ Bond", key: "bond", highlight: v => v && v !== "None" && v !== "" ? "#ef4444" : "#22c55e" },
                { label: "🎁 Perks", key: "perks" },
                { label: "📅 Joining", key: "joiningDate" },
              ].map((row, ri) => {
                const vals = validOffers.map(o => o[row.key]);
                const numVals = vals.map(v => parseFloat(v) || 0);
                const maxVal = Math.max(...numVals);
                return (
                  <tr key={ri} style={{ borderBottom: "1px solid #1a2340" }}>
                    <td style={{ padding: "12px 20px", color: "#8892a4", fontSize: 13, fontWeight: 600 }}>{row.label}</td>
                    {validOffers.map((o, i) => {
                      const val = o[row.key];
                      const isBest = row.best === "max" && parseFloat(val) === maxVal && maxVal > 0;
                      return (
                        <td key={i} style={{ padding: "12px 16px", textAlign: "center" }}>
                          <span style={{
                            color: row.highlight ? row.highlight(val) : isBest ? "#22c55e" : "#c8d0e0",
                            fontSize: 13, fontWeight: isBest ? 700 : 400,
                            background: isBest ? "#22c55e11" : "transparent",
                            borderRadius: 6, padding: isBest ? "2px 8px" : 0
                          }}>
                            {val ? val + (row.suffix || "") : "—"}
                            {isBest && " 🏆"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* AI Analysis */}
      {analyzed && aiSummary && (
        <>
          {/* Best for each priority */}
          {(aiSummary.best_for_growth || aiSummary.best_for_money) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 20 }}>
              {[
                { icon: "📈", label: "Best for Growth", val: aiSummary.best_for_growth, col: "#22c55e" },
                { icon: "💰", label: "Best for Money", val: aiSummary.best_for_money, col: "#f59e0b" },
                { icon: "⚖️", label: "Best Work-Life", val: aiSummary.best_for_worklife, col: "#4F7EFF" },
              ].map((b, i) => (
                <div key={i} style={{ background: b.col + "11", border: `1px solid ${b.col}33`, borderRadius: 12, padding: 16 }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{b.icon}</div>
                  <div style={{ color: b.col, fontSize: 12, fontWeight: 700, marginBottom: 6 }}>{b.label}</div>
                  <div style={{ color: "#c8d0e0", fontSize: 13, lineHeight: 1.5 }}>{b.val || "—"}</div>
                </div>
              ))}
            </div>
          )}

          {/* Offer insights */}
          {aiSummary.offer_insights?.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${aiSummary.offer_insights.length}, 1fr)`, gap: 14, marginBottom: 20 }}>
              {aiSummary.offer_insights.map((insight, i) => (
                <div key={i} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>{insight.company}</div>
                    <span style={{ background: verdictColor(insight.verdict) + "22", color: verdictColor(insight.verdict), borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700 }}>{insight.verdict}</span>
                  </div>
                  {insight.pros?.map((p, j) => <div key={j} style={{ color: "#22c55e", fontSize: 12, marginBottom: 4 }}>✓ {p}</div>)}
                  {insight.cons?.map((c, j) => <div key={j} style={{ color: "#ef4444", fontSize: 12, marginBottom: 4 }}>✗ {c}</div>)}
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20, marginBottom: 16 }}>
            <div style={{ color: "#4F7EFF", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>🤖 AI Summary</div>
            <div style={{ color: "#a8b4cc", fontSize: 14, lineHeight: 1.7, marginBottom: 12 }}>{aiSummary.summary}</div>
            {aiSummary.overall_recommendation && (
              <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>🏆 Recommendation: {aiSummary.overall_recommendation}</div>
              </div>
            )}
            {aiSummary.watch_out && (
              <div style={{ marginTop: 10, background: "#f59e0b11", border: "1px solid #f59e0b33", borderRadius: 8, padding: 12 }}>
                <div style={{ color: "#f59e0b", fontSize: 13 }}>⚠️ Watch Out: {aiSummary.watch_out}</div>
              </div>
            )}
          </div>

          <div style={{ color: "#3a4560", fontSize: 12, textAlign: "center" }}>AI provides neutral guidance. The final decision is always yours.</div>
        </>
      )}
    </div>
  );
}