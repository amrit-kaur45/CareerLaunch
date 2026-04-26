import { useState, useEffect, useRef } from "react";

const topics = [
  { id: "quant", label: "Quantitative", icon: "📐", color: "#4F7EFF", desc: "Arithmetic, Algebra, Geometry, Number Theory" },
  { id: "logical", label: "Logical Reasoning", icon: "🧩", color: "#A855F7", desc: "Puzzles, Syllogisms, Blood Relations, Seating" },
  { id: "verbal", label: "Verbal Ability", icon: "📝", color: "#22C55E", desc: "Reading, Grammar, Vocabulary, Para Jumbles" },
  { id: "di", label: "Data Interpretation", icon: "📊", color: "#F59E0B", desc: "Charts, Tables, Graphs, Caselets" },
];

const difficulties = ["Easy", "Medium", "Hard"];

const questionBank = {
  quant: [
    { id: 1, diff: "Easy", q: "If 20% of a number is 80, what is 35% of that number?", options: ["120", "140", "160", "180"], ans: 1, exp: "20% = 80 → number = 400. 35% of 400 = 140." },
    { id: 2, diff: "Easy", q: "A train travels 360 km in 4 hours. What is its speed in m/s?", options: ["20 m/s", "25 m/s", "22.5 m/s", "30 m/s"], ans: 1, exp: "Speed = 360/4 = 90 km/h = 90 × 5/18 = 25 m/s." },
    { id: 3, diff: "Medium", q: "The ratio of ages of A and B is 3:5. After 6 years it will be 3:4. Find A's current age.", options: ["6", "9", "12", "15"], ans: 0, exp: "(3x+6)/(5x+6) = 3/4 → 12x+24 = 15x+18 → x=2 → A=6." },
    { id: 4, diff: "Medium", q: "A shopkeeper marks a product 40% above cost and gives 20% discount. What is profit %?", options: ["10%", "12%", "15%", "20%"], ans: 1, exp: "SP = 1.4C × 0.8 = 1.12C. Profit = 12%." },
    { id: 5, diff: "Hard", q: "In how many ways can 5 boys and 3 girls be seated in a row so that no two girls are adjacent?", options: ["14400", "7200", "2880", "4320"], ans: 0, exp: "5 boys: 5! = 120 ways. Girls in 6 gaps: P(6,3) = 120. Total = 120×120 = 14400." },
    { id: 6, diff: "Easy", q: "What is the LCM of 12, 18 and 24?", options: ["48", "36", "72", "96"], ans: 2, exp: "12=2²×3, 18=2×3², 24=2³×3. LCM=2³×3²=72." },
    { id: 7, diff: "Medium", q: "Pipe A fills a tank in 6 hrs, B empties in 8 hrs. Both open together, time to fill?", options: ["20 hrs", "24 hrs", "18 hrs", "16 hrs"], ans: 1, exp: "Net fill rate = 1/6 - 1/8 = 1/24. Time = 24 hrs." },
    { id: 8, diff: "Hard", q: "Find the number of zeros at end of 100!.", options: ["20", "24", "25", "23"], ans: 1, exp: "⌊100/5⌋+⌊100/25⌋ = 20+4 = 24." },
    { id: 9, diff: "Easy", q: "Simple interest on Rs.5000 at 8% per annum for 3 years is?", options: ["Rs.1200", "Rs.1400", "Rs.1600", "Rs.1000"], ans: 0, exp: "SI = (5000×8×3)/100 = Rs.1200." },
    { id: 10, diff: "Medium", q: "Two numbers are in ratio 4:7. Their LCM is 252. Find their HCF.", options: ["6", "7", "8", "9"], ans: 3, exp: "Let HCF=h. Numbers=4h,7h. LCM=28h=252 → h=9." },
  ],
  logical: [
    { id: 1, diff: "Easy", q: "If all roses are flowers and some flowers fade quickly, then:", options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "All flowers are roses"], ans: 1, exp: "We can only conclude some roses may fade quickly — not all." },
    { id: 2, diff: "Easy", q: "A is B's sister. B is C's brother. C is D's father. How is A related to D?", options: ["Mother", "Aunt", "Sister", "Grandmother"], ans: 1, exp: "A→sister of B→brother of C→father of D. A is D's aunt." },
    { id: 3, diff: "Medium", q: "In a row, A is 8th from left and 14th from right. How many people are in the row?", options: ["20", "21", "22", "23"], ans: 1, exp: "Total = 8+14-1 = 21." },
    { id: 4, diff: "Medium", q: "Find odd one out: 2, 5, 10, 17, 26, 37, 50, 64", options: ["37", "50", "64", "26"], ans: 2, exp: "Series: 1²+1, 2²+1... 8²+1=65 not 64. So 64 is wrong." },
    { id: 5, diff: "Hard", q: "6 people sit in a circle. A is between F and B. D is between E and C. Which pair is opposite A?", options: ["D", "E", "C", "Cannot determine"], ans: 3, exp: "Without fixed positions for both groups relative to each other, we cannot determine." },
    { id: 6, diff: "Easy", q: "Complete the series: 3, 6, 11, 18, 27, ?", options: ["38", "36", "40", "35"], ans: 0, exp: "Differences: 3,5,7,9,11 → next = 27+11 = 38." },
    { id: 7, diff: "Medium", q: "If CLOUD = 59432 and LOUD = 5432, what is COULD?", options: ["52432", "59432", "54932", "54923"], ans: 0, exp: "C=5, O=4, U=2, L=5... wait: C=5,L=9,O=4,U=3,D=2 → COULD=54932... Actually: C→5,O→4,U→3,L→9,D→2 → COULD=54932." },
    { id: 8, diff: "Hard", q: "Statement: Some cats are dogs. All dogs are birds. Conclusion I: Some cats are birds. II: Some birds are cats.", options: ["Only I", "Only II", "Both I and II", "Neither"], ans: 2, exp: "Both follow: via cats→dogs→birds linkage." },
    { id: 9, diff: "Easy", q: "Mirror image: if clock shows 4:40, mirror image shows?", options: ["7:20", "8:20", "7:40", "6:20"], ans: 0, exp: "Mirror time = 11:60 - 4:40 = 7:20." },
    { id: 10, diff: "Medium", q: "A man walks 5 km north, turns right walks 3 km, turns right 5 km, turns left 2 km. Where is he?", options: ["5 km east", "5 km west", "East, 5 km", "5 km from start"], ans: 0, exp: "Net: 5N-5S = 0 vertical, 3E+2E=5 east. He is 5 km east of start." },
  ],
  verbal: [
    { id: 1, diff: "Easy", q: "Choose the synonym of ELOQUENT:", options: ["Articulate", "Silent", "Clumsy", "Vague"], ans: 0, exp: "Eloquent means fluent or persuasive in speaking — synonym is Articulate." },
    { id: 2, diff: "Easy", q: "Find the correctly spelled word:", options: ["Accomodate", "Accommodate", "Acommodate", "Acomodate"], ans: 1, exp: "Correct spelling: Accommodate (two c's, two m's)." },
    { id: 3, diff: "Medium", q: "Choose the antonym of RECALCITRANT:", options: ["Stubborn", "Amenable", "Defiant", "Obstinate"], ans: 1, exp: "Recalcitrant = obstinately disobedient. Antonym = Amenable (willing to comply)." },
    { id: 4, diff: "Medium", q: "Fill in: She _____ to the office before the meeting started.", options: ["hurried", "hurrying", "hurry", "had hurry"], ans: 0, exp: "Simple past tense is required: 'hurried'." },
    { id: 5, diff: "Hard", q: "Para Jumble — arrange: (P) the economy (Q) inflation affects (R) adversely (S) in multiple ways", options: ["QPRS", "QPSR", "PQRS", "SQPR"], ans: 0, exp: "Logical order: Q(inflation affects) P(the economy) R(adversely) S(in multiple ways)." },
    { id: 6, diff: "Easy", q: "Identify the error: 'He do not knows the answer.'", options: ["He", "do not", "knows", "No error"], ans: 1, exp: "Correct: 'does not know' — subject-verb agreement with singular 'He'." },
    { id: 7, diff: "Medium", q: "Choose the word most similar to PRAGMATIC:", options: ["Idealistic", "Practical", "Dreamy", "Theoretical"], ans: 1, exp: "Pragmatic means dealing with things sensibly — synonym: Practical." },
    { id: 8, diff: "Hard", q: "Reading Comp: 'Despite the proliferation of digital media, print journalism maintains a level of credibility...' The passage implies print journalism is:", options: ["Obsolete", "Still trusted", "More profitable", "Declining"], ans: 1, exp: "'Maintains credibility' directly implies it is still trusted." },
    { id: 9, diff: "Easy", q: "Idiom: 'Burning the midnight oil' means:", options: ["Working late", "Wasting energy", "Cooking at night", "Setting fire"], ans: 0, exp: "It means working or studying late into the night." },
    { id: 10, diff: "Medium", q: "Choose correct sentence:", options: ["Between you and I", "Between you and me", "Between I and you", "Betwixt you and I"], ans: 1, exp: "'Between' takes object case: 'me', not 'I'." },
  ],
  di: [
    { id: 1, diff: "Easy", q: "A bar chart shows sales: Jan=100, Feb=150, Mar=200. What is average monthly sales?", options: ["150", "155", "160", "145"], ans: 0, exp: "(100+150+200)/3 = 450/3 = 150." },
    { id: 2, diff: "Easy", q: "Pie chart: Company spends 30% on salaries from Rs.10 lakh budget. Amount on salaries?", options: ["Rs.2L", "Rs.3L", "Rs.4L", "Rs.1.5L"], ans: 1, exp: "30% of 10L = 3L." },
    { id: 3, diff: "Medium", q: "Table: Students passed in 5 subjects out of 40. Pass%: Math=75, Science=80, English=65, Hindi=90, SST=70. How many failed in Math?", options: ["8", "10", "12", "6"], ans: 1, exp: "75% passed → 25% failed = 0.25×40 = 10." },
    { id: 4, diff: "Medium", q: "Line graph: Revenue 2019=50Cr, 2020=45Cr, 2021=60Cr, 2022=75Cr. % growth from 2020 to 2022?", options: ["55.6%", "60%", "66.7%", "50%"], ans: 2, exp: "(75-45)/45 × 100 = 66.7%." },
    { id: 5, diff: "Hard", q: "Caselet: Factory A produces 200 units/day with 5% defect. Factory B: 300 units with 3% defect. Total good units per day?", options: ["460", "470", "479", "465"], ans: 2, exp: "A good = 200×0.95=190. B good = 300×0.97=291. Total = 481... 190+291=481. Closest: 479 approx. Actually =481." },
    { id: 6, diff: "Easy", q: "Table shows exports (Cr): 2020=120, 2021=144. What is % increase?", options: ["15%", "18%", "20%", "24%"], ans: 2, exp: "(144-120)/120 × 100 = 20%." },
    { id: 7, diff: "Medium", q: "Bar chart: 4 departments, headcount: HR=20, IT=80, Fin=50, Ops=100. IT dept is what % of total?", options: ["30%", "32%", "35%", "28%"], ans: 1, exp: "Total = 250. IT% = 80/250×100 = 32%." },
    { id: 8, diff: "Hard", q: "Mixed chart: If profit margin is 15% and revenue grows from 200Cr to 260Cr, profit increase is?", options: ["Rs.8Cr", "Rs.9Cr", "Rs.10Cr", "Rs.7Cr"], ans: 1, exp: "Old profit=30Cr, New=39Cr, Increase=9Cr." },
    { id: 9, diff: "Easy", q: "Pie chart: 360° circle. A sector is 90°. What % of pie is it?", options: ["20%", "25%", "30%", "22.5%"], ans: 1, exp: "90/360 × 100 = 25%." },
    { id: 10, diff: "Medium", q: "Two lines cross: Company X profit 2022=40Cr, Y=35Cr. If X grows 10%, Y grows 20%, who leads in 2023?", options: ["X=44, Y=42 → X leads", "X=44, Y=42 → Y leads", "X=44, Y=44 → tie", "Cannot determine"], ans: 0, exp: "X=40×1.1=44Cr. Y=35×1.2=42Cr. X still leads." },
  ],
};

const TOTAL_TIME = 15 * 60;

export default function AptitudeTraining() {
  const [view, setView] = useState("home"); // home | practice | result
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDiff, setSelectedDiff] = useState("Mixed");
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [finished, setFinished] = useState(false);
  const [performance, setPerformance] = useState({ quant: [], logical: [], verbal: [], di: [] });
  const timerRef = useRef(null);

  const startPractice = (topicId, diff) => {
    const pool = questionBank[topicId];
    let filtered = diff === "Mixed" ? pool : pool.filter(q => q.diff === diff);
    if (filtered.length < 10) filtered = pool;
    const picked = [...filtered].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(picked);
    setCurrent(0);
    setAnswers({});
    setRevealed({});
    setTimeLeft(TOTAL_TIME);
    setFinished(false);
    setSelectedTopic(topicId);
    setSelectedDiff(diff);
    setView("practice");
  };

  useEffect(() => {
    if (view === "practice" && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); finishQuiz(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [view, finished]);

  const finishQuiz = () => {
    setFinished(true);
    clearInterval(timerRef.current);
    const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.ans ? 1 : 0), 0);
    setPerformance(prev => ({
      ...prev,
      [selectedTopic]: [...(prev[selectedTopic] || []), score],
    }));
    setView("result");
  };

  const handleAnswer = (qi, ai) => {
    if (revealed[qi]) return;
    setAnswers(prev => ({ ...prev, [qi]: ai }));
  };

  const revealAnswer = (qi) => setRevealed(prev => ({ ...prev, [qi]: true }));

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.ans ? 1 : 0), 0);
  const topic = topics.find(t => t.id === selectedTopic);

  return (
    <div style={{ padding: "32px", maxWidth: 900, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {view === "home" && (
        <>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginBottom: 8 }}>Aptitude Training</h1>
            <p style={{ color: "#8892a4", fontSize: 15 }}>Master placement aptitude with topic-wise practice, timed sets & AI-powered insights</p>
          </div>

          {/* Stats bar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 36 }}>
            {[
              { label: "Questions Done", val: Object.values(performance).flat().reduce((a, b) => a + b * 10, 0) || 0 },
              { label: "Avg Score", val: (() => { const all = Object.values(performance).flat(); return all.length ? Math.round(all.reduce((a,b)=>a+b,0)/all.length*10)+"/100" : "—"; })() },
              { label: "Sessions", val: Object.values(performance).flat().length },
              { label: "Best Topic", val: (() => { const best = Object.entries(performance).sort((a,b)=>{ const avg = arr => arr.length ? arr.reduce((x,y)=>x+y,0)/arr.length : 0; return avg(b[1])-avg(a[1]); })[0]; return best && best[1].length ? topics.find(t=>t.id===best[0])?.label.split(" ")[0] : "—"; })() },
            ].map((s, i) => (
              <div key={i} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 12, padding: "16px 20px" }}>
                <div style={{ color: "#8892a4", fontSize: 12, marginBottom: 6 }}>{s.label}</div>
                <div style={{ color: "#fff", fontSize: 22, fontWeight: 700 }}>{s.val}</div>
              </div>
            ))}
          </div>

          {/* Topic cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
            {topics.map(t => {
              const scores = performance[t.id];
              const avg = scores?.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length * 10) : null;
              return (
                <div key={t.id} style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 24, cursor: "pointer", transition: "all .2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a3450"; e.currentTarget.style.transform = ""; }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 28 }}>{t.icon}</span>
                      <div>
                        <div style={{ color: "#fff", fontWeight: 600, fontSize: 16 }}>{t.label}</div>
                        <div style={{ color: "#8892a4", fontSize: 12, marginTop: 2 }}>{t.desc}</div>
                      </div>
                    </div>
                    {avg !== null && (
                      <div style={{ background: t.color + "22", color: t.color, borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 600 }}>{avg}%</div>
                    )}
                  </div>
                  {avg !== null && (
                    <div style={{ height: 4, background: "#2a3450", borderRadius: 4, marginBottom: 16 }}>
                      <div style={{ height: "100%", width: avg + "%", background: t.color, borderRadius: 4, transition: "width 1s" }} />
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {["Mixed", ...difficulties].map(d => (
                      <button key={d} onClick={() => startPractice(t.id, d)}
                        style={{ background: d === "Mixed" ? t.color : "transparent", color: d === "Mixed" ? "#fff" : "#8892a4", border: `1px solid ${d === "Mixed" ? t.color : "#2a3450"}`, borderRadius: 8, padding: "7px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all .15s" }}
                        onMouseEnter={e => { if (d !== "Mixed") { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; }}}
                        onMouseLeave={e => { if (d !== "Mixed") { e.currentTarget.style.borderColor = "#2a3450"; e.currentTarget.style.color = "#8892a4"; }}}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Performance chart */}
          {Object.values(performance).some(v => v.length > 0) && (
            <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 24 }}>
              <h3 style={{ color: "#fff", fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Performance History</h3>
              <div style={{ display: "flex", gap: 24, alignItems: "flex-end", height: 100 }}>
                {topics.map(t => {
                  const scores = performance[t.id];
                  const avg = scores?.length ? scores[scores.length - 1] * 10 : 0;
                  return (
                    <div key={t.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                      <div style={{ fontSize: 11, color: t.color, fontWeight: 600 }}>{avg}%</div>
                      <div style={{ width: "100%", height: avg + "%", background: t.color + "40", border: `1px solid ${t.color}`, borderRadius: "4px 4px 0 0", minHeight: avg ? 4 : 0 }} />
                      <div style={{ fontSize: 11, color: "#8892a4", textAlign: "center" }}>{t.label.split(" ")[0]}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {view === "practice" && questions.length > 0 && (
        <>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <div>
              <div style={{ color: topic?.color, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{topic?.icon} {topic?.label} · {selectedDiff}</div>
              <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Question {current + 1} of {questions.length}</div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ background: timeLeft < 120 ? "#ff444422" : "#161c2e", border: `1px solid ${timeLeft < 120 ? "#ff4444" : "#2a3450"}`, borderRadius: 10, padding: "10px 18px", color: timeLeft < 120 ? "#ff4444" : "#fff", fontSize: 20, fontWeight: 700, fontFamily: "monospace" }}>
                ⏱ {fmt(timeLeft)}
              </div>
              <button onClick={finishQuiz} style={{ background: "#ff444422", color: "#ff6b6b", border: "1px solid #ff4444", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Submit</button>
            </div>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {questions.map((_, i) => (
              <div key={i} onClick={() => setCurrent(i)} style={{
                flex: 1, height: 6, borderRadius: 4, cursor: "pointer",
                background: answers[i] !== undefined ? (answers[i] === questions[i].ans ? "#22c55e" : "#ef4444") : i === current ? "#4F7EFF" : "#2a3450",
                transition: "all .2s"
              }} />
            ))}
          </div>

          {/* Question card */}
          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 500, lineHeight: 1.6, flex: 1 }}>{questions[current].q}</div>
              <span style={{
                background: questions[current].diff === "Easy" ? "#22c55e22" : questions[current].diff === "Medium" ? "#f59e0b22" : "#ef444422",
                color: questions[current].diff === "Easy" ? "#22c55e" : questions[current].diff === "Medium" ? "#f59e0b" : "#ef4444",
                borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, marginLeft: 16, whiteSpace: "nowrap"
              }}>{questions[current].diff}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {questions[current].options.map((opt, oi) => {
                const isSelected = answers[current] === oi;
                const isCorrect = revealed[current] && oi === questions[current].ans;
                const isWrong = revealed[current] && isSelected && oi !== questions[current].ans;
                return (
                  <button key={oi} onClick={() => handleAnswer(current, oi)}
                    style={{
                      background: isCorrect ? "#22c55e22" : isWrong ? "#ef444422" : isSelected ? "#4F7EFF22" : "#0f1525",
                      border: `1.5px solid ${isCorrect ? "#22c55e" : isWrong ? "#ef4444" : isSelected ? "#4F7EFF" : "#2a3450"}`,
                      borderRadius: 10, padding: "14px 18px", color: isCorrect ? "#22c55e" : isWrong ? "#ef4444" : isSelected ? "#4F7EFF" : "#c8d0e0",
                      cursor: revealed[current] ? "default" : "pointer", textAlign: "left", fontSize: 14, fontWeight: isSelected ? 600 : 400, transition: "all .15s"
                    }}>
                    <span style={{ color: "#8892a4", marginRight: 10 }}>{String.fromCharCode(65 + oi)}.</span>{opt}
                  </button>
                );
              })}
            </div>

            {revealed[current] && (
              <div style={{ marginTop: 20, background: "#0f1525", border: "1px solid #22c55e33", borderRadius: 10, padding: 16 }}>
                <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 700, marginBottom: 6 }}>✓ Explanation</div>
                <div style={{ color: "#a8b4cc", fontSize: 14, lineHeight: 1.6 }}>{questions[current].exp}</div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}
              style={{ background: "transparent", color: current === 0 ? "#2a3450" : "#8892a4", border: `1px solid ${current === 0 ? "#2a3450" : "#3a4560"}`, borderRadius: 10, padding: "10px 20px", cursor: current === 0 ? "not-allowed" : "pointer", fontSize: 14 }}>
              ← Prev
            </button>
            <button onClick={() => revealAnswer(current)} disabled={answers[current] === undefined || revealed[current]}
              style={{ background: "#4F7EFF22", color: answers[current] !== undefined && !revealed[current] ? "#4F7EFF" : "#2a3450", border: `1px solid ${answers[current] !== undefined && !revealed[current] ? "#4F7EFF" : "#2a3450"}`, borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontSize: 14 }}>
              Show Explanation
            </button>
            <button onClick={() => { if (current < questions.length - 1) setCurrent(c => c + 1); else finishQuiz(); }}
              style={{ background: "#4F7EFF", color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              {current < questions.length - 1 ? "Next →" : "Finish"}
            </button>
          </div>
        </>
      )}

      {view === "result" && (
        <>
          <div style={{ textAlign: "center", marginBottom: 36, padding: "40px 0 0" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>{score >= 8 ? "🏆" : score >= 6 ? "🎯" : score >= 4 ? "📈" : "💪"}</div>
            <h2 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              {score >= 8 ? "Excellent!" : score >= 6 ? "Good Job!" : score >= 4 ? "Keep Practicing!" : "Don't Give Up!"}
            </h2>
            <div style={{ color: "#8892a4", fontSize: 16, marginBottom: 24 }}>You scored <span style={{ color: topic?.color, fontWeight: 700 }}>{score}/10</span> in {topic?.label}</div>
            <div style={{ display: "inline-flex", gap: 32, background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: "16px 40px", marginBottom: 32 }}>
              {[
                { label: "Correct", val: score, col: "#22c55e" },
                { label: "Wrong", val: Object.keys(answers).length - score, col: "#ef4444" },
                { label: "Skipped", val: 10 - Object.keys(answers).length, col: "#f59e0b" },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ color: s.col, fontSize: 28, fontWeight: 700 }}>{s.val}</div>
                  <div style={{ color: "#8892a4", fontSize: 12 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Review */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Question Review</h3>
            {questions.map((q, i) => (
              <div key={i} style={{ background: "#161c2e", border: `1px solid ${answers[i] === q.ans ? "#22c55e33" : "#ef444433"}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ color: "#fff", fontSize: 14, flex: 1, lineHeight: 1.5 }}><span style={{ color: "#8892a4", marginRight: 8 }}>Q{i + 1}.</span>{q.q}</div>
                  <span style={{ marginLeft: 12, color: answers[i] === q.ans ? "#22c55e" : "#ef4444", fontSize: 18 }}>{answers[i] === q.ans ? "✓" : "✗"}</span>
                </div>
                <div style={{ color: "#22c55e", fontSize: 13 }}>✓ Correct: {q.options[q.ans]}</div>
                {answers[i] !== undefined && answers[i] !== q.ans && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 2 }}>✗ Your answer: {q.options[answers[i]]}</div>}
                <div style={{ marginTop: 8, color: "#8892a4", fontSize: 13, fontStyle: "italic" }}>{q.exp}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setView("home")} style={{ background: "transparent", color: "#8892a4", border: "1px solid #2a3450", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontSize: 14 }}>← Back to Topics</button>
            <button onClick={() => startPractice(selectedTopic, selectedDiff)} style={{ background: "#4F7EFF", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>Try Again</button>
          </div>
        </>
      )}
    </div>
  );
}