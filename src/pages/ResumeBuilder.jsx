import { useState } from "react";

const SECTIONS = ["Personal", "Experience", "Education", "Skills", "Summary"];

const defaultData = {
  personal: { name: "", title: "", email: "", phone: "", location: "", website: "" },
  summary: "",
  experience: [{ id: 1, company: "", role: "", start: "", end: "", current: false, bullets: "" }],
  education: [{ id: 1, school: "", degree: "", year: "" }],
  skills: "",
};

export default function ResumeBuilder() {
  const [active, setActive] = useState("Personal");
  const [data, setData] = useState(defaultData);

  const setPersonal = (field, val) =>
    setData((d) => ({ ...d, personal: { ...d.personal, [field]: val } }));

  const setExp = (id, field, val) =>
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));

  const addExp = () =>
    setData((d) => ({
      ...d,
      experience: [...d.experience, { id: Date.now(), company: "", role: "", start: "", end: "", current: false, bullets: "" }],
    }));

  const removeExp = (id) =>
    setData((d) => ({ ...d, experience: d.experience.filter((e) => e.id !== id) }));

  const setEdu = (id, field, val) =>
    setData((d) => ({
      ...d,
      education: d.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    }));

  const addEdu = () =>
    setData((d) => ({
      ...d,
      education: [...d.education, { id: Date.now(), school: "", degree: "", year: "" }],
    }));

  const removeEdu = (id) =>
    setData((d) => ({ ...d, education: d.education.filter((e) => e.id !== id) }));

  const handlePrint = () => window.print();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:          #111114;
          --bg-panel:    #16161A;
          --bg-card:     #1C1C21;
          --bg-input:    #1E1E24;
          --border:      #2A2A33;
          --border-focus:#C4A882;
          --accent:      #C4A882;
          --accent-dim:  rgba(196,168,130,0.1);
          --accent-glow: rgba(196,168,130,0.15);
          --text:        #EDEBE6;
          --text-muted:  #6B6B78;
          --text-sub:    #9A9AA8;
          --danger:      #E05C5C;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rb-wrap {
          display: flex;
          height: calc(100vh - 64px);
          background: var(--bg);
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow: hidden;
        }

        /* ── LEFT PANEL ── */
        .rb-left {
          width: 300px;
          flex-shrink: 0;
          background: var(--bg-panel);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .rb-left-header {
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--border);
        }

        .rb-left-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1rem;
          letter-spacing: -0.02em; color: var(--text);
        }

        .rb-left-sub {
          font-size: 0.78rem; color: var(--text-muted);
          margin-top: 3px;
        }

        .rb-nav {
          padding: 0.75rem 0.75rem;
          display: flex; flex-direction: column; gap: 2px;
        }

        .rb-nav-item {
          display: flex; align-items: center; gap: 10px;
          padding: 0.6rem 0.85rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem; font-weight: 500;
          color: var(--text-muted);
          transition: background 0.16s, color 0.16s;
          border: none; background: none; text-align: left;
          width: 100%;
        }

        .rb-nav-item:hover { background: var(--accent-dim); color: var(--text); }

        .rb-nav-item.active {
          background: var(--accent-dim);
          color: var(--accent);
        }

        .rb-nav-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--border); flex-shrink: 0;
          transition: background 0.16s;
        }

        .rb-nav-item.active .rb-nav-dot { background: var(--accent); box-shadow: 0 0 6px var(--accent); }

        .rb-download {
          margin: auto 1rem 1rem;
          background: var(--accent);
          color: #111114; border: none;
          padding: 0.65rem 1rem; border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 0.875rem; font-weight: 700;
          cursor: pointer; letter-spacing: -0.01em;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 2px 20px var(--accent-glow);
          width: calc(100% - 2rem);
        }

        .rb-download:hover { opacity: 0.88; transform: translateY(-1px); }

        /* ── MIDDLE FORM ── */
        .rb-form {
          flex: 1;
          overflow-y: auto;
          padding: 2rem 2rem;
          scrollbar-width: thin;
          scrollbar-color: var(--border) transparent;
        }

        .rb-form::-webkit-scrollbar { width: 4px; }
        .rb-form::-webkit-scrollbar-track { background: transparent; }
        .rb-form::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        .rb-section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.1rem;
          letter-spacing: -0.02em; color: var(--text);
          margin-bottom: 0.35rem;
        }

        .rb-section-sub {
          font-size: 0.82rem; color: var(--text-muted);
          margin-bottom: 1.75rem;
        }

        .rb-grid-2 {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;
          margin-bottom: 1rem;
        }

        .rb-field { display: flex; flex-direction: column; gap: 5px; }
        .rb-field.full { grid-column: 1 / -1; }

        .rb-label {
          font-size: 0.75rem; font-weight: 500;
          color: var(--text-sub); letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .rb-input, .rb-textarea {
          background: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 7px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 400;
          padding: 0.6rem 0.85rem;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
          width: 100%;
        }

        .rb-input::placeholder, .rb-textarea::placeholder { color: var(--text-muted); }

        .rb-input:focus, .rb-textarea:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .rb-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }

        /* Experience / Education cards */
        .rb-entry-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.25rem;
          margin-bottom: 1rem;
          position: relative;
        }

        .rb-entry-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .rb-entry-label {
          font-family: 'Syne', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          color: var(--text-muted); letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .rb-remove-btn {
          background: none; border: none;
          color: var(--text-muted); font-size: 1rem;
          cursor: pointer; padding: 2px 6px; border-radius: 4px;
          transition: color 0.15s, background 0.15s;
        }

        .rb-remove-btn:hover { color: var(--danger); background: rgba(224,92,92,0.08); }

        .rb-add-btn {
          display: flex; align-items: center; gap: 7px;
          background: none; border: 1px dashed var(--border);
          color: var(--text-muted); font-size: 0.875rem; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          padding: 0.65rem 1rem; border-radius: 8px;
          cursor: pointer; width: 100%;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }

        .rb-add-btn:hover {
          border-color: var(--accent); color: var(--accent);
          background: var(--accent-dim);
        }

        .rb-checkbox-row {
          display: flex; align-items: center; gap: 8px;
          margin-top: 0.5rem;
        }

        .rb-checkbox {
          width: 15px; height: 15px; accent-color: var(--accent); cursor: pointer;
        }

        .rb-checkbox-label { font-size: 0.82rem; color: var(--text-muted); }

        /* ── RIGHT PREVIEW ── */
        .rb-preview {
          width: 420px;
          flex-shrink: 0;
          background: #F7F5F2;
          overflow-y: auto;
          border-left: 1px solid var(--border);
          scrollbar-width: thin;
        }

        .rb-preview::-webkit-scrollbar { width: 4px; }
        .rb-preview::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

        .resume-doc {
          padding: 2.5rem 2.25rem;
          min-height: 100%;
          font-family: 'DM Sans', sans-serif;
          color: #1A1A1A;
        }

        .resume-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.75rem;
          letter-spacing: -0.03em; color: #111114;
          line-height: 1.1;
        }

        .resume-title {
          font-size: 0.9rem; font-weight: 500;
          color: #8A6A42; margin-top: 3px; margin-bottom: 0.75rem;
        }

        .resume-contact {
          display: flex; flex-wrap: wrap; gap: 0.5rem 1.25rem;
          font-size: 0.78rem; color: #666; margin-bottom: 1.25rem;
          padding-bottom: 1.25rem;
          border-bottom: 1.5px solid #E8E2D9;
        }

        .resume-contact span { display: flex; align-items: center; gap: 4px; }

        .resume-section { margin-bottom: 1.4rem; }

        .resume-section-head {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #C4A882; margin-bottom: 0.6rem;
          padding-bottom: 4px;
          border-bottom: 1px solid #E8E2D9;
        }

        .resume-summary {
          font-size: 0.85rem; line-height: 1.7; color: #444;
        }

        .resume-exp-item { margin-bottom: 1rem; }

        .resume-exp-top {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 1px;
        }

        .resume-role {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.9rem; color: #111;
        }

        .resume-dates {
          font-size: 0.75rem; color: #999; white-space: nowrap;
        }

        .resume-company {
          font-size: 0.82rem; color: #8A6A42; margin-bottom: 0.35rem;
        }

        .resume-bullets {
          font-size: 0.82rem; line-height: 1.65; color: #555;
          white-space: pre-wrap;
        }

        .resume-edu-item {
          display: flex; justify-content: space-between;
          align-items: baseline; margin-bottom: 0.5rem;
        }

        .resume-degree {
          font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 0.88rem; color: #111;
        }

        .resume-school { font-size: 0.8rem; color: #777; }
        .resume-edu-year { font-size: 0.75rem; color: #999; }

        .resume-skills {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
        }

        .resume-skill-tag {
          background: #EDE8E0; color: #5A4A35;
          font-size: 0.75rem; font-weight: 500;
          padding: 0.22rem 0.65rem; border-radius: 100px;
        }

        .resume-placeholder {
          color: #CCC; font-style: italic; font-size: 0.82rem;
        }

        /* Print */
        @media print {
          .rb-left, .rb-form, .rb-preview { display: none !important; }
          .resume-doc { display: block !important; padding: 0; }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .rb-preview { display: none; }
        }
        @media (max-width: 600px) {
          .rb-left { width: 220px; }
          .rb-grid-2 { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="rb-wrap">

        {/* ── LEFT NAV ── */}
        <aside className="rb-left">
          <div className="rb-left-header">
            <div className="rb-left-title">Resume Builder</div>
            <div className="rb-left-sub">Fill in each section</div>
          </div>
          <nav className="rb-nav">
            {SECTIONS.map((s) => (
              <button
                key={s}
                className={`rb-nav-item${active === s ? " active" : ""}`}
                onClick={() => setActive(s)}
              >
                <span className="rb-nav-dot" />
                {s}
              </button>
            ))}
          </nav>
          <button className="rb-download" onClick={handlePrint}>
            ↓ Download PDF
          </button>
        </aside>

        {/* ── FORM ── */}
        <main className="rb-form">

          {active === "Personal" && (
            <>
              <div className="rb-section-title">Personal Info</div>
              <div className="rb-section-sub">This appears at the top of your resume.</div>
              <div className="rb-grid-2">
                <div className="rb-field">
                  <label className="rb-label">Full Name</label>
                  <input className="rb-input" placeholder="Jane Smith" value={data.personal.name}
                    onChange={(e) => setPersonal("name", e.target.value)} />
                </div>
                <div className="rb-field">
                  <label className="rb-label">Job Title</label>
                  <input className="rb-input" placeholder="Product Designer" value={data.personal.title}
                    onChange={(e) => setPersonal("title", e.target.value)} />
                </div>
                <div className="rb-field">
                  <label className="rb-label">Email</label>
                  <input className="rb-input" placeholder="jane@email.com" value={data.personal.email}
                    onChange={(e) => setPersonal("email", e.target.value)} />
                </div>
                <div className="rb-field">
                  <label className="rb-label">Phone</label>
                  <input className="rb-input" placeholder="+1 555 000 0000" value={data.personal.phone}
                    onChange={(e) => setPersonal("phone", e.target.value)} />
                </div>
                <div className="rb-field">
                  <label className="rb-label">Location</label>
                  <input className="rb-input" placeholder="New York, NY" value={data.personal.location}
                    onChange={(e) => setPersonal("location", e.target.value)} />
                </div>
                <div className="rb-field">
                  <label className="rb-label">Website / LinkedIn</label>
                  <input className="rb-input" placeholder="linkedin.com/in/jane" value={data.personal.website}
                    onChange={(e) => setPersonal("website", e.target.value)} />
                </div>
              </div>
            </>
          )}

          {active === "Summary" && (
            <>
              <div className="rb-section-title">Professional Summary</div>
              <div className="rb-section-sub">2–3 sentences about who you are and what you bring.</div>
              <div className="rb-field">
                <label className="rb-label">Summary</label>
                <textarea className="rb-textarea" rows={5}
                  placeholder="Results-driven designer with 5+ years building intuitive products..."
                  value={data.summary}
                  onChange={(e) => setData((d) => ({ ...d, summary: e.target.value }))}
                />
              </div>
            </>
          )}

          {active === "Experience" && (
            <>
              <div className="rb-section-title">Work Experience</div>
              <div className="rb-section-sub">Add your most recent roles first.</div>
              {data.experience.map((exp, i) => (
                <div className="rb-entry-card" key={exp.id}>
                  <div className="rb-entry-header">
                    <span className="rb-entry-label">Position {i + 1}</span>
                    {data.experience.length > 1 && (
                      <button className="rb-remove-btn" onClick={() => removeExp(exp.id)}>✕</button>
                    )}
                  </div>
                  <div className="rb-grid-2">
                    <div className="rb-field">
                      <label className="rb-label">Company</label>
                      <input className="rb-input" placeholder="Acme Corp" value={exp.company}
                        onChange={(e) => setExp(exp.id, "company", e.target.value)} />
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">Role</label>
                      <input className="rb-input" placeholder="Senior Designer" value={exp.role}
                        onChange={(e) => setExp(exp.id, "role", e.target.value)} />
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">Start Date</label>
                      <input className="rb-input" placeholder="Jan 2022" value={exp.start}
                        onChange={(e) => setExp(exp.id, "start", e.target.value)} />
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">End Date</label>
                      <input className="rb-input" placeholder="Dec 2023" value={exp.end}
                        disabled={exp.current}
                        onChange={(e) => setExp(exp.id, "end", e.target.value)} />
                      <div className="rb-checkbox-row">
                        <input type="checkbox" className="rb-checkbox" checked={exp.current}
                          onChange={(e) => setExp(exp.id, "current", e.target.checked)} />
                        <span className="rb-checkbox-label">Currently working here</span>
                      </div>
                    </div>
                    <div className="rb-field full">
                      <label className="rb-label">Key Achievements / Bullets</label>
                      <textarea className="rb-textarea" rows={4}
                        placeholder={"• Led redesign that increased retention by 24%\n• Managed cross-functional team of 6"}
                        value={exp.bullets}
                        onChange={(e) => setExp(exp.id, "bullets", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="rb-add-btn" onClick={addExp}>+ Add another role</button>
            </>
          )}

          {active === "Education" && (
            <>
              <div className="rb-section-title">Education</div>
              <div className="rb-section-sub">Include your highest qualifications.</div>
              {data.education.map((edu, i) => (
                <div className="rb-entry-card" key={edu.id}>
                  <div className="rb-entry-header">
                    <span className="rb-entry-label">Education {i + 1}</span>
                    {data.education.length > 1 && (
                      <button className="rb-remove-btn" onClick={() => removeEdu(edu.id)}>✕</button>
                    )}
                  </div>
                  <div className="rb-grid-2">
                    <div className="rb-field">
                      <label className="rb-label">School / University</label>
                      <input className="rb-input" placeholder="MIT" value={edu.school}
                        onChange={(e) => setEdu(edu.id, "school", e.target.value)} />
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">Degree</label>
                      <input className="rb-input" placeholder="B.Sc. Computer Science" value={edu.degree}
                        onChange={(e) => setEdu(edu.id, "degree", e.target.value)} />
                    </div>
                    <div className="rb-field">
                      <label className="rb-label">Graduation Year</label>
                      <input className="rb-input" placeholder="2021" value={edu.year}
                        onChange={(e) => setEdu(edu.id, "year", e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
              <button className="rb-add-btn" onClick={addEdu}>+ Add another education</button>
            </>
          )}

          {active === "Skills" && (
            <>
              <div className="rb-section-title">Skills</div>
              <div className="rb-section-sub">Separate each skill with a comma.</div>
              <div className="rb-field">
                <label className="rb-label">Skills</label>
                <textarea className="rb-textarea" rows={4}
                  placeholder="Figma, React, TypeScript, User Research, Prototyping, SQL"
                  value={data.skills}
                  onChange={(e) => setData((d) => ({ ...d, skills: e.target.value }))}
                />
              </div>
            </>
          )}

        </main>

        {/* ── LIVE PREVIEW ── */}
        <aside className="rb-preview">
          <div className="resume-doc">

            {/* Header */}
            <div className="resume-name">{data.personal.name || <span className="resume-placeholder">Your Name</span>}</div>
            {data.personal.title && <div className="resume-title">{data.personal.title}</div>}
            <div className="resume-contact">
              {data.personal.email && <span>✉ {data.personal.email}</span>}
              {data.personal.phone && <span>✆ {data.personal.phone}</span>}
              {data.personal.location && <span>⌖ {data.personal.location}</span>}
              {data.personal.website && <span>⊕ {data.personal.website}</span>}
            </div>

            {/* Summary */}
            {data.summary && (
              <div className="resume-section">
                <div className="resume-section-head">Summary</div>
                <p className="resume-summary">{data.summary}</p>
              </div>
            )}

            {/* Experience */}
            {data.experience.some((e) => e.company || e.role) && (
              <div className="resume-section">
                <div className="resume-section-head">Experience</div>
                {data.experience.filter((e) => e.company || e.role).map((exp) => (
                  <div className="resume-exp-item" key={exp.id}>
                    <div className="resume-exp-top">
                      <span className="resume-role">{exp.role || "Role"}</span>
                      <span className="resume-dates">
                        {exp.start}{exp.start && (exp.end || exp.current) ? " – " : ""}
                        {exp.current ? "Present" : exp.end}
                      </span>
                    </div>
                    <div className="resume-company">{exp.company}</div>
                    {exp.bullets && <div className="resume-bullets">{exp.bullets}</div>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {data.education.some((e) => e.school || e.degree) && (
              <div className="resume-section">
                <div className="resume-section-head">Education</div>
                {data.education.filter((e) => e.school || e.degree).map((edu) => (
                  <div className="resume-edu-item" key={edu.id}>
                    <div>
                      <div className="resume-degree">{edu.degree || "Degree"}</div>
                      <div className="resume-school">{edu.school}</div>
                    </div>
                    <div className="resume-edu-year">{edu.year}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {data.skills && (
              <div className="resume-section">
                <div className="resume-section-head">Skills</div>
                <div className="resume-skills">
                  {data.skills.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                    <span className="resume-skill-tag" key={s}>{s}</span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </>
  );
}