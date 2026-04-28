import { useEffect, useState } from "react";
import AptitudeTraining from "../pages/AptitudeTraining";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(0);
  const [showAptitude, setShowAptitude] = useState(false);

  // ---------------- LOAD DATA ----------------
  useEffect(() => {
    try {
      const data = localStorage.getItem("savedResume"); // FIXED KEY

      if (data) {
        const parsed = JSON.parse(data);
        setResume(parsed);
        calculateScore(parsed);
      }
    } catch (err) {
      console.error("Invalid resume data:", err);
    }
  }, []);

  // ---------------- SCORE LOGIC ----------------
  const calculateScore = (data) => {
    let tempScore = 0;

    if (data?.name) tempScore += 10;
    if (data?.email) tempScore += 10;
    if (data?.summary && data.summary.length > 30) tempScore += 15;

    if (data?.experience) tempScore += 20;
    if (data?.education) tempScore += 10;

    if (data?.skills && data.skills.split(",").filter(Boolean).length >= 3)
      tempScore += 15;

    setScore(Math.min(tempScore, 100));
  };

  // ---------------- STATUS ----------------
  const getStatus = () => {
    if (score >= 80) return "Strong";
    if (score >= 50) return "Average";
    return "Needs Improvement";
  };

  // ---------------- RESET VIEW ----------------
  const handleBack = () => {
    setShowAptitude(false);
  };

  // ---------------- UI ----------------
  return (
    <>
      {showAptitude ? (
        <div>
          {/* Back button */}
          <button
            onClick={handleBack}
            style={{
              position: "absolute",
              top: 20,
              left: 20,
              padding: "10px 16px",
              borderRadius: 8,
              border: "1px solid #2a3450",
              background: "#161c2e",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ← Back to Dashboard
          </button>

          <AptitudeTraining />
        </div>
      ) : (
        <div className="dashboard-wrap">

          {/* HEADER */}
          <div className="dashboard-header">
            <h1>Resume Dashboard</h1>
            <p>Analyze and improve your resume</p>

            <button
              onClick={() => setShowAptitude(true)}
              style={{
                marginTop: 16,
                padding: "10px 18px",
                background: "#4F7EFF",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Start Aptitude Training
            </button>
          </div>

          {/* EMPTY STATE */}
          {!resume ? (
            <div className="dashboard-empty">
              No resume found. Please create one first.
            </div>
          ) : (
            <div className="dashboard-grid">

              {/* SCORE CARD */}
              <div className="dashboard-card">
                <h2>Resume Score</h2>

                <div className="score-circle">
                  <span>{score}</span>
                </div>

                <p className="score-status">{getStatus()}</p>
              </div>

              {/* BREAKDOWN */}
              <div className="dashboard-card">
                <h2>Breakdown</h2>

                <ul className="score-list">
                  <li>Name: {resume.name ? "✔" : "✕"}</li>
                  <li>Email: {resume.email ? "✔" : "✕"}</li>
                  <li>Summary: {resume.summary ? "✔" : "✕"}</li>
                  <li>Experience: {resume.experience ? "✔" : "✕"}</li>
                  <li>Education: {resume.education ? "✔" : "✕"}</li>
                  <li>Skills: {resume.skills ? "✔" : "✕"}</li>
                </ul>
              </div>

              {/* SUGGESTIONS */}
              <div className="dashboard-card">
                <h2>Suggestions</h2>

                <ul className="suggestion-list">
                  {!resume.summary && <li>Add a strong summary</li>}
                  {!resume.skills && <li>Include key skills</li>}
                  {!resume.experience && <li>Add experience</li>}
                  {resume.skills &&
                    resume.skills.split(",").length < 3 && (
                      <li>Add at least 3 skills</li>
                    )}
                </ul>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
}