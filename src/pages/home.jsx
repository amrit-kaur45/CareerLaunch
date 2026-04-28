import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: "✦",
      title: "ATS-Optimised",
      desc: "Every resume is built to pass applicant tracking systems used by top companies.",
    },
    {
      icon: "◈",
      title: "Expert Templates",
      desc: "Curated designs for every industry — from startups to Fortune 500.",
    },
    {
      icon: "⬡",
      title: "One-Click Export",
      desc: "Download as PDF instantly, perfectly formatted every single time.",
    },
    {
      icon: "◎",
      title: "AI suggestions",
      desc: "Smart content hints that help you say more with less — no blank-page dread.",
    },
  ];

  const stats = [
    { value: "240k+", label: "Resumes built" },
    { value: "91%", label: "Interview rate" },
    { value: "4 min", label: "Average build time" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:           #111114;
          --bg-card:      #18181B;
          --bg-card-hover:#1E1E22;
          --border:       #28282E;
          --border-hover: #3A3A45;
          --accent:       #C4A882;
          --accent-dim:   rgba(196,168,130,0.1);
          --accent-glow:  rgba(196,168,130,0.13);
          --text:         #EDEBE6;
          --text-muted:   #6B6B78;
          --text-sub:     #9A9AA8;
        }

        .home-wrap {
          background: var(--bg);
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow-x: hidden;
        }

        /* ── HERO ── */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 120px 2rem 6rem;
          overflow: hidden;
        }

        /* background noise grain */
        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }

        /* radial glow behind headline */
        .hero::after {
          content: '';
          position: absolute;
          top: 20%; left: 50%;
          transform: translateX(-50%);
          width: 600px; height: 400px;
          background: radial-gradient(ellipse, rgba(196,168,130,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--accent);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 0.35rem 0.9rem;
          border-radius: 100px;
          margin-bottom: 2rem;
          animation: fadeUp 0.6s ease both;
        }

        .hero-badge-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--accent);
        }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(2.6rem, 6vw, 5rem);
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: var(--text);
          max-width: 780px;
          margin: 0 auto 1.5rem;
          animation: fadeUp 0.6s 0.1s ease both;
        }

        .hero-title em {
          font-style: normal;
          color: var(--accent);
          position: relative;
        }

        .hero-title em::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          opacity: 0.3;
          border-radius: 2px;
        }

        .hero-sub {
          font-size: 1.05rem;
          font-weight: 400;
          color: var(--text-sub);
          max-width: 500px;
          margin: 0 auto 2.75rem;
          line-height: 1.7;
          animation: fadeUp 0.6s 0.2s ease both;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          justify-content: center;
          flex-wrap: wrap;
          animation: fadeUp 0.6s 0.3s ease both;
        }

        .btn-primary {
          background: var(--accent);
          color: #111114;
          border: none;
          padding: 0.72rem 1.6rem;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem; font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px var(--accent-glow);
          white-space: nowrap;
        }

        .btn-primary:hover {
          opacity: 0.88;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(196,168,130,0.25);
        }

        .btn-secondary {
          background: none;
          border: 1px solid var(--border);
          color: var(--text-sub);
          padding: 0.72rem 1.4rem;
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.925rem; font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          white-space: nowrap;
        }

        .btn-secondary:hover {
          border-color: var(--border-hover);
          color: var(--text);
          background: rgba(237,235,230,0.04);
        }

        /* Stats row */
        .hero-stats {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          margin-top: 4rem;
          animation: fadeUp 0.6s 0.4s ease both;
        }

        .stat-divider {
          width: 1px; height: 28px;
          background: var(--border);
        }

        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem; font-weight: 800;
          color: var(--text); letter-spacing: -0.03em;
        }

        .stat-label {
          font-size: 0.78rem; font-weight: 400;
          color: var(--text-muted); letter-spacing: 0.02em;
          margin-top: 2px;
        }

        /* ── FEATURES ── */
        .features-section {
          padding: 6rem 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .section-label {
          font-size: 0.75rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.75rem;
        }

        .section-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 3.5rem;
          max-width: 480px;
          line-height: 1.15;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }

        .feature-card {
          background: var(--bg-card);
          padding: 2rem 1.75rem;
          transition: background 0.2s;
          position: relative;
        }

        .feature-card:hover {
          background: var(--bg-card-hover);
        }

        .feature-icon {
          font-size: 1.1rem;
          color: var(--accent);
          margin-bottom: 1rem;
          display: block;
        }

        .feature-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: -0.02em;
          color: var(--text);
          margin-bottom: 0.5rem;
        }

        .feature-desc {
          font-size: 0.875rem;
          line-height: 1.65;
          color: var(--text-muted);
        }

        /* ── CTA BAND ── */
        .cta-section {
          margin: 0 2rem 6rem;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid var(--border);
          border-radius: 16px;
          background: var(--bg-card);
          padding: 4rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 260px; height: 260px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(196,168,130,0.07), transparent 70%);
          pointer-events: none;
        }

        .cta-title {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.5rem, 2.5vw, 2rem);
          letter-spacing: -0.03em;
          color: var(--text);
          max-width: 420px;
          line-height: 1.2;
        }

        .cta-title em {
          font-style: normal;
          color: var(--accent);
        }

        /* ── FOOTER ── */
        .home-footer {
          border-top: 1px solid var(--border);
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .footer-logo {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--text-muted);
          letter-spacing: -0.02em;
          text-decoration: none;
        }

        .footer-logo em { font-style: normal; color: var(--accent); }

        .footer-copy {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 640px) {
          .hero-stats { gap: 1.25rem; flex-wrap: wrap; justify-content: center; }
          .cta-section { padding: 2.5rem 1.75rem; }
          .home-footer { justify-content: center; text-align: center; }
        }
      `}</style>

      <div className="home-wrap">

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Free to start · No credit card
          </div>

          <h1 className="hero-title">
            Your resume.<br />
            <em>Refined.</em> Launched.
          </h1>

          <p className="hero-sub">
            Build a job-winning resume in minutes — beautifully designed,
            ATS-ready, and tailored to get you noticed.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="btn-primary">Build My Resume →</Link>
            <Link to="/dashboard" className="btn-secondary">Go to Dashboard</Link>
            <Link to="#templates" className="btn-secondary">See Templates</Link>
          </div>

          <div className="hero-stats">
            {stats.map((s, i) => (
              <>
                {i > 0 && <div className="stat-divider" key={`div-${i}`} />}
                <div key={s.label} style={{ textAlign: "center" }}>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </>
            ))}
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="features-section" id="features">
          <p className="section-label">Why CareerLaunch</p>
          <h2 className="section-title">Everything you need. Nothing you don't.</h2>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="cta-section">
          <h2 className="cta-title">
            Ready to land your <em>dream role?</em>
          </h2>
          <Link to="/signup" className="btn-primary">Get Started Free →</Link>
        </section>

        {/* ── FOOTER ── */}
        <footer className="home-footer">
          <Link to="/" className="footer-logo">Career<em>Launch</em></Link>
          <span className="footer-copy">© 2025 CareerLaunch. All rights reserved.</span>
        </footer>

      </div>
    </>
  );
};

export default Home;