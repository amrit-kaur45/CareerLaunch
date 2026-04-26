import { useState } from "react";

const COMPANY_DB = {
  "TCS": {
    logo: "🏢", type: "Service MNC", difficulty: "Medium", package: "3.5–7 LPA",
    topics: ["Data Structures", "OOP Concepts", "SQL Basics", "Verbal Ability", "Quantitative Aptitude", "Logical Reasoning"],
    pastQuestions: [
      "Reverse a string without using built-in functions.",
      "What is polymorphism? Give a real example.",
      "Write a SQL query to find the second highest salary.",
      "A train goes 60 km/h. Time to travel 300 km?",
      "Explain ACID properties of a database.",
      "What is the difference between stack and heap memory?",
    ],
    rounds: ["Online Aptitude Test", "Technical Interview", "Managerial Round", "HR Round"],
    tips: "Focus on aptitude speed. TCS NQT has a coding section — practice easy-medium problems.",
  },
  "Infosys": {
    logo: "🔷", type: "Service MNC", difficulty: "Medium", package: "3.6–8 LPA",
    topics: ["Algorithms", "DBMS", "OS Concepts", "Networking Basics", "Verbal", "Puzzles"],
    pastQuestions: [
      "Explain the difference between TCP and UDP.",
      "What are indexes in SQL? When should you use them?",
      "Find duplicates in an array.",
      "What is paging in OS?",
      "Explain Agile methodology briefly.",
      "A farmer has 17 sheep, all but 9 die. How many are left?",
    ],
    rounds: ["Aptitude Test", "Pseudocode Test", "Technical HR", "Final HR"],
    tips: "Infosys InfyTQ certification helps. Prepare Hackwithinfy for higher packages.",
  },
  "Wipro": {
    logo: "🌐", type: "Service MNC", difficulty: "Easy-Medium", package: "3.5–6.5 LPA",
    topics: ["Basic Coding", "Aptitude", "Verbal", "Email Writing", "OOP", "DBMS"],
    pastQuestions: [
      "Write a program to check if a number is prime.",
      "What is inheritance? Types of inheritance in OOP.",
      "SELECT DISTINCT vs SELECT — what is the difference?",
      "What is a binary search tree?",
      "Explain the OSI model layers.",
      "Write an email declining a meeting politely.",
    ],
    rounds: ["Online Test (Aptitude + Coding)", "Essay Writing", "Technical Interview", "HR Interview"],
    tips: "Wipro WILP and TURBO tracks have different requirements. Know which track you're applying for.",
  },
  "Flipkart": {
    logo: "🛒", type: "Product Startup", difficulty: "Hard", package: "18–40 LPA",
    topics: ["DSA (Hard)", "System Design", "LLD", "Behavioural (STAR)", "OS", "Distributed Systems"],
    pastQuestions: [
      "Design a system like Amazon's product recommendation engine.",
      "Find the kth largest element in an unsorted array.",
      "LRU Cache implementation.",
      "Explain eventual consistency in distributed systems.",
      "How would you design Flipkart's cart service?",
      "Tell me about a time you resolved a conflict in your team.",
    ],
    rounds: ["Online Coding (2–3 DSA)", "Technical Round 1", "Technical Round 2 (System Design)", "Bar Raiser", "HR"],
    tips: "Hard DSA is a must. Practice Leetcode Medium-Hard. System Design basics required even for freshers.",
  },
  "Google": {
    logo: "🔍", type: "FAANG", difficulty: "Very Hard", package: "30–80 LPA",
    topics: ["DSA (Expert)", "System Design", "Problem Solving", "Algorithms", "Behavioural", "Coding Patterns"],
    pastQuestions: [
      "Implement a trie and support autocomplete.",
      "Find the shortest path in a weighted graph.",
      "Design Google Drive's file storage architecture.",
      "Count islands in a 2D matrix (BFS/DFS).",
      "What is consistent hashing?",
      "Describe a time you made a mistake and how you handled it.",
    ],
    rounds: ["Resume Shortlist", "Phone Screen", "4–5 Technical Rounds", "Hiring Committee Review"],
    tips: "Grind Leetcode for 4–6 months. Focus on patterns: sliding window, two pointers, DP, graphs.",
  },
  "Amazon": {
    logo: "📦", type: "FAANG", difficulty: "Hard", package: "25–60 LPA",
    topics: ["DSA", "System Design", "Leadership Principles", "OOP", "Behavioural STAR", "Scalability"],
    pastQuestions: [
      "Serialize and deserialize a binary tree.",
      "Design Amazon's order tracking system.",
      "Find all pairs in array summing to target (Two Sum variants).",
      "Explain CAP theorem with examples.",
      "Tell me about a time you took ownership of a project.",
      "How would you handle a situation where your manager disagrees with you?",
    ],
    rounds: ["Online Assessment", "Technical Interview ×2", "System Design", "Bar Raiser (LP)", "HR"],
    tips: "Learn Amazon's 16 Leadership Principles. Prepare 2 STAR stories per principle. OA has 2 DSA problems in 70 min.",
  },
};

const DEFAULT_CHECKLIST = ["Studied core topics", "Solved 5 past questions", "Done 1 mock interview", "Revised OS/DBMS/Networks", "Checked company news/culture", "Done 1 GD practice"];

export default function CompanyTracker() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [addMode, setAddMode] = useState(false);
  const [search, setSearch] = useState("");
  const [checklists, setChecklists] = useState({});
  const [customInput, setCustomInput] = useState("");
  const [targetDates, setTargetDates] = useState({});
  const [interviewDone, setInterviewDone] = useState({});

  const availableCompanies = Object.keys(COMPANY_DB).filter(c => !companies.includes(c) && c.toLowerCase().includes(search.toLowerCase()));

  const addCompany = (name) => {
    setCompanies(prev => [...prev, name]);
    setChecklists(prev => ({ ...prev, [name]: {} }));
    setAddMode(false);
    setSearch("");
    setSelected(name);
  };

  const removeCompany = (name) => {
    setCompanies(prev => prev.filter(c => c !== name));
    if (selected === name) setSelected(null);
  };

  const toggleCheck = (company, item) => {
    setChecklists(prev => ({
      ...prev,
      [company]: { ...prev[company], [item]: !prev[company]?.[item] }
    }));
  };

  const getProgress = (company) => {
    const done = DEFAULT_CHECKLIST.filter(i => checklists[company]?.[i]).length;
    return Math.round((done / DEFAULT_CHECKLIST.length) * 100);
  };

  const company = selected ? COMPANY_DB[selected] : null;
  const progress = selected ? getProgress(selected) : 0;
  const progressColor = progress >= 80 ? "#22c55e" : progress >= 50 ? "#f59e0b" : "#4F7EFF";

  const daysUntil = (dateStr) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", fontFamily: "'DM Sans', sans-serif", gap: 0 }}>
      {/* Sidebar */}
      <div style={{ width: 260, background: "#0f1525", borderRight: "1px solid #2a3450", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px", borderBottom: "1px solid #2a3450" }}>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 12 }}>🏢 Company Tracker</div>
          <button onClick={() => setAddMode(true)}
            style={{ width: "100%", background: "#4F7EFF", color: "#fff", border: "none", borderRadius: 8, padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            + Add Company
          </button>
        </div>

        {addMode && (
          <div style={{ padding: 12, borderBottom: "1px solid #2a3450" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search company..."
              autoFocus
              style={{ width: "100%", background: "#161c2e", border: "1px solid #2a3450", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", marginBottom: 8, fontFamily: "inherit" }} />
            {availableCompanies.length === 0 && (
              <div style={{ color: "#8892a4", fontSize: 12, textAlign: "center", padding: "8px 0" }}>No matching companies</div>
            )}
            {availableCompanies.map(c => (
              <button key={c} onClick={() => addCompany(c)}
                style={{ width: "100%", background: "transparent", border: "none", color: "#c8d0e0", fontSize: 13, padding: "8px 10px", cursor: "pointer", textAlign: "left", borderRadius: 6, display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e2840"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <span>{COMPANY_DB[c].logo}</span> {c}
                <span style={{ marginLeft: "auto", color: "#3a4560", fontSize: 11 }}>{COMPANY_DB[c].difficulty}</span>
              </button>
            ))}
            <button onClick={() => setAddMode(false)} style={{ marginTop: 8, width: "100%", background: "transparent", border: "1px solid #2a3450", color: "#8892a4", borderRadius: 6, padding: "6px 0", cursor: "pointer", fontSize: 12 }}>Cancel</button>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {companies.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: "#3a4560", fontSize: 13 }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
              Add companies you're targeting
            </div>
          )}
          {companies.map(c => {
            const prog = getProgress(c);
            const days = daysUntil(targetDates[c]);
            return (
              <div key={c} onClick={() => setSelected(c)}
                style={{ padding: "12px 16px", cursor: "pointer", borderBottom: "1px solid #1a2340", background: selected === c ? "#1e2840" : "transparent", borderLeft: `3px solid ${selected === c ? "#4F7EFF" : "transparent"}`, transition: "all .15s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{COMPANY_DB[c].logo}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{c}</div>
                    <div style={{ color: "#8892a4", fontSize: 11 }}>{COMPANY_DB[c].type}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); removeCompany(c); }} style={{ background: "transparent", border: "none", color: "#3a4560", cursor: "pointer", fontSize: 16 }}>×</button>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, background: "#2a3450", borderRadius: 4 }}>
                    <div style={{ height: "100%", width: prog + "%", background: prog >= 80 ? "#22c55e" : prog >= 50 ? "#f59e0b" : "#4F7EFF", borderRadius: 4 }} />
                  </div>
                  <span style={{ color: "#8892a4", fontSize: 11 }}>{prog}%</span>
                </div>
                {days !== null && (
                  <div style={{ marginTop: 4, color: days <= 3 ? "#ef4444" : days <= 7 ? "#f59e0b" : "#22c55e", fontSize: 11 }}>
                    {days > 0 ? `📅 ${days} days left` : days === 0 ? "📅 Drive today!" : "Drive passed"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {!selected && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", color: "#3a4560", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
            <div style={{ color: "#8892a4", fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Select a company to start preparing</div>
            <div style={{ color: "#3a4560", fontSize: 14 }}>Add companies using the + button and track your preparation progress</div>
          </div>
        )}

        {selected && company && (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                  <span style={{ fontSize: 36 }}>{company.logo}</span>
                  <div>
                    <h2 style={{ color: "#fff", fontSize: 24, fontWeight: 700 }}>{selected}</h2>
                    <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                      <span style={{ background: "#4F7EFF22", color: "#4F7EFF", borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>{company.type}</span>
                      <span style={{ background: company.difficulty === "Hard" || company.difficulty === "Very Hard" ? "#ef444422" : company.difficulty === "Medium" ? "#f59e0b22" : "#22c55e22", color: company.difficulty === "Hard" || company.difficulty === "Very Hard" ? "#ef4444" : company.difficulty === "Medium" ? "#f59e0b" : "#22c55e", borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>{company.difficulty}</span>
                      <span style={{ background: "#22c55e22", color: "#22c55e", borderRadius: 6, padding: "2px 10px", fontSize: 12 }}>{company.package}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flex: "column", gap: 8, alignItems: "flex-end" }}>
                <input type="date" value={targetDates[selected] || ""}
                  onChange={e => setTargetDates(prev => ({ ...prev, [selected]: e.target.value }))}
                  style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 13, outline: "none", fontFamily: "inherit" }} />
                <div style={{ fontSize: 11, color: "#8892a4", textAlign: "right", marginTop: 4 }}>Set drive date for countdown</div>
              </div>
            </div>

            {/* Progress */}
            <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>Preparation Progress</div>
                <div style={{ color: progressColor, fontSize: 20, fontWeight: 800 }}>{progress}%</div>
              </div>
              <div style={{ height: 8, background: "#2a3450", borderRadius: 8 }}>
                <div style={{ height: "100%", width: progress + "%", background: progressColor, borderRadius: 8, transition: "width 0.8s ease" }} />
              </div>
              <div style={{ color: "#8892a4", fontSize: 12, marginTop: 8 }}>
                {progress === 100 ? "✅ Fully prepared! Go ace it." : progress >= 70 ? "🔥 Almost there. Keep going!" : "📚 Keep checking off items below."}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              {/* Checklist */}
              <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20 }}>
                <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>📋 Preparation Checklist</div>
                {DEFAULT_CHECKLIST.map(item => (
                  <label key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
                    <div onClick={() => toggleCheck(selected, item)}
                      style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${checklists[selected]?.[item] ? "#22c55e" : "#3a4560"}`, background: checklists[selected]?.[item] ? "#22c55e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", transition: "all .15s" }}>
                      {checklists[selected]?.[item] && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ color: checklists[selected]?.[item] ? "#8892a4" : "#c8d0e0", fontSize: 13, textDecoration: checklists[selected]?.[item] ? "line-through" : "none" }}>{item}</span>
                  </label>
                ))}
              </div>

              {/* Rounds + Tips */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20 }}>
                  <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🔄 Interview Rounds</div>
                  {company.rounds.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#4F7EFF22", color: "#4F7EFF", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
                      <span style={{ color: "#c8d0e0", fontSize: 13 }}>{r}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: "#4F7EFF11", border: "1px solid #4F7EFF33", borderRadius: 14, padding: 16 }}>
                  <div style={{ color: "#4F7EFF", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>💡 Pro Tip</div>
                  <div style={{ color: "#a8b4cc", fontSize: 13, lineHeight: 1.6 }}>{company.tips}</div>
                </div>
              </div>
            </div>

            {/* Topics to cover */}
            <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>📚 Topics to Cover</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {company.topics.map((t, i) => (
                  <span key={i} style={{ background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "6px 14px", color: "#c8d0e0", fontSize: 13 }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Past Questions */}
            <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 14, padding: 20 }}>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 14 }}>❓ Past Interview Questions</div>
              {company.pastQuestions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12, padding: "10px 14px", background: "#0f1525", borderRadius: 8, border: "1px solid #1e2840" }}>
                  <span style={{ color: "#4F7EFF", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>Q{i + 1}</span>
                  <span style={{ color: "#c8d0e0", fontSize: 13, lineHeight: 1.5 }}>{q}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}