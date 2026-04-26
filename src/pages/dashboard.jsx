import { useEffect, useState } from "react";

export default function Dashboard() {
  const [resume, setResume] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const data = localStorage.getItem("resume");

    if (data) {
      const parsed = JSON.parse(data);
      setResume(parsed);

      let tempScore = 0;
      if (parsed.name) tempScore += 25;
      if (parsed.email) tempScore += 20;
      if (parsed.skills?.length > 5) tempScore += 25;
      if (parsed.projects?.length > 5) tempScore += 30;

      setScore(tempScore);
    }
  }, []);

  const getJobs = (skills = "") => {
    const s = skills.toLowerCase();
    let jobs = [];

    if (s.includes("react")) jobs.push("Frontend Developer");
    if (s.includes("node")) jobs.push("Backend Developer");
    if (s.includes("sql")) jobs.push("Database Developer");
    if (s.includes("python") || s.includes("java")) jobs.push("Software Engineer");

    if (!jobs.length) jobs.push("Internship (Skill Building)");

    return jobs;
  };

  if (!resume) {
    return (
      <div style={emptyStyle}>
        <h2>No Resume Found</h2>
        <p>Please create your resume first.</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <h1>Dashboard 📊</h1>
      <h3>Welcome {resume.name} 🚀</h3>

      {/* GRID */}
      <div style={grid}>

        {/* SCORE CARD */}
        <div style={card}>
          <h3>ATS Score</h3>

          <div style={barBg}>
            <div style={{ ...barFill, width: `${score}%` }}></div>
          </div>

          <h2>{score}/100</h2>
        </div>

        {/* INFO */}
        <div style={card}>
          <h3>Email</h3>
          <p>{resume.email}</p>
        </div>

        <div style={card}>
          <h3>Skills</h3>
          <p>{resume.skills}</p>
        </div>

        <div style={card}>
          <h3>Projects</h3>
          <p>{resume.projects}</p>
        </div>

        {/* JOBS */}
        <div style={cardWide}>
          <h3>Recommended Jobs 💼</h3>
          <ul>
            {getJobs(resume.skills).map((job, i) => (
              <li key={i}>{job}</li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}

/* STYLES */

const pageStyle = {
  padding: "20px"
};

const emptyStyle = {
  padding: "50px",
  textAlign: "center"
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
  marginTop: "20px"
};

const card = {
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff"
};

const cardWide = {
  gridColumn: "span 2",
  padding: "15px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  background: "#fff"
};

const barBg = {
  height: "15px",
  background: "#eee",
  borderRadius: "10px",
  overflow: "hidden",
  marginTop: "10px"
};

const barFill = {
  height: "100%",
  background: "green",
  transition: "0.3s"
};