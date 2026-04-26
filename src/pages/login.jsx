import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/resume");
    }, 1200);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --bg:           #111114;
          --bg-card:      #17171B;
          --bg-input:     #1E1E24;
          --border:       #2A2A33;
          --border-focus: #C4A882;
          --accent:       #C4A882;
          --accent-dim:   rgba(196,168,130,0.1);
          --accent-glow:  rgba(196,168,130,0.18);
          --text:         #EDEBE6;
          --text-muted:   #6B6B78;
          --text-sub:     #9A9AA6;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-page {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          overflow: hidden;
        }

        /* ── LEFT BRAND PANEL ── */
        .login-brand {
          flex: 1;
          background: var(--bg-card);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          position: relative;
          overflow: hidden;
        }

        /* decorative grid lines */
        .login-brand::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(var(--border) 1px, transparent 1px),
            linear-gradient(90deg, var(--border) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.35;
        }

        /* radial glow */
        .login-brand::after {
          content: '';
          position: absolute;
          bottom: -100px; left: -100px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(196,168,130,0.07), transparent 65%);
          pointer-events: none;
        }

        .brand-top {
          position: relative; z-index: 1;
        }

        .brand-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; user-select: none;
          margin-bottom: 3.5rem;
        }

        .brand-logo-icon {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1.5px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 14px var(--accent-glow);
        }

        .brand-logo-icon svg { width: 14px; height: 14px; }

        .brand-logo-text {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.05rem;
          color: var(--text); letter-spacing: -0.02em;
        }

        .brand-logo-text em { font-style: normal; color: var(--accent); }

        .brand-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.8rem, 3vw, 2.6rem);
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: var(--text);
          max-width: 360px;
        }

        .brand-headline em {
          font-style: normal; color: var(--accent);
        }

        .brand-sub {
          margin-top: 1rem;
          font-size: 0.9rem; line-height: 1.7;
          color: var(--text-sub); max-width: 320px;
        }

        /* testimonial */
        .brand-testimonial {
          position: relative; z-index: 1;
          border: 1px solid var(--border);
          border-radius: 12px;
          background: rgba(255,255,255,0.025);
          padding: 1.25rem 1.5rem;
          backdrop-filter: blur(8px);
        }

        .testimonial-quote {
          font-size: 0.875rem; line-height: 1.7;
          color: var(--text-sub);
          font-style: italic;
          margin-bottom: 1rem;
        }

        .testimonial-author {
          display: flex; align-items: center; gap: 10px;
        }

        .testimonial-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--accent-dim);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif;
          font-size: 0.75rem; font-weight: 700; color: var(--accent);
        }

        .testimonial-name {
          font-size: 0.82rem; font-weight: 500; color: var(--text);
        }

        .testimonial-role {
          font-size: 0.75rem; color: var(--text-muted);
        }

        /* ── RIGHT FORM PANEL ── */
        .login-form-wrap {
          width: 480px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2.5rem;
        }

        .login-card {
          width: 100%;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .login-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 1.6rem;
          letter-spacing: -0.03em; color: var(--text);
          margin-bottom: 0.35rem;
        }

        .login-subheading {
          font-size: 0.875rem; color: var(--text-muted);
          margin-bottom: 2rem;
        }

        /* Toggle tabs */
        .login-tabs {
          display: flex;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 9px;
          padding: 4px;
          margin-bottom: 1.75rem;
          gap: 4px;
        }

        .login-tab {
          flex: 1; padding: 0.5rem;
          border: none; border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          background: none; color: var(--text-muted);
        }

        .login-tab.active {
          background: var(--accent);
          color: #111114;
          font-weight: 600;
        }

        /* Fields */
        .login-field {
          display: flex; flex-direction: column; gap: 6px;
          margin-bottom: 1rem;
        }

        .login-label {
          font-size: 0.75rem; font-weight: 500;
          color: var(--text-sub); letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .login-input-wrap {
          position: relative;
        }

        .login-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--text);
          border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          padding: 0.65rem 0.9rem;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }

        .login-input.has-toggle { padding-right: 2.75rem; }

        .login-input::placeholder { color: var(--text-muted); }

        .login-input:focus {
          border-color: var(--border-focus);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        .toggle-pass {
          position: absolute; right: 10px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: var(--text-muted); cursor: pointer;
          font-size: 0.82rem; padding: 2px 4px;
          transition: color 0.15s;
        }

        .toggle-pass:hover { color: var(--accent); }

        .login-forgot {
          display: block; text-align: right;
          font-size: 0.78rem; color: var(--text-muted);
          text-decoration: none; margin-top: -0.5rem;
          margin-bottom: 1rem;
          transition: color 0.15s;
        }

        .login-forgot:hover { color: var(--accent); }

        /* Submit */
        .login-submit {
          width: 100%;
          background: var(--accent);
          color: #111114; border: none;
          padding: 0.72rem 1rem;
          border-radius: 8px;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem; font-weight: 700;
          letter-spacing: -0.01em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 2px 20px var(--accent-glow);
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 0.5rem;
        }

        .login-submit:hover:not(:disabled) {
          opacity: 0.88; transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(196,168,130,0.28);
        }

        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Spinner */
        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(17,17,20,0.3);
          border-top-color: #111114;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider */
        .login-divider {
          display: flex; align-items: center; gap: 0.75rem;
          margin: 1.25rem 0;
        }

        .login-divider-line {
          flex: 1; height: 1px; background: var(--border);
        }

        .login-divider-text {
          font-size: 0.75rem; color: var(--text-muted); white-space: nowrap;
        }

        /* OAuth */
        .login-oauth {
          width: 100%;
          background: none; border: 1px solid var(--border);
          color: var(--text-sub);
          padding: 0.62rem 1rem; border-radius: 8px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem; font-weight: 500;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: border-color 0.18s, color 0.18s, background 0.18s;
        }

        .login-oauth:hover {
          border-color: var(--border-focus);
          color: var(--text);
          background: var(--accent-dim);
        }

        .login-switch {
          text-align: center; margin-top: 1.5rem;
          font-size: 0.82rem; color: var(--text-muted);
        }

        .login-switch a {
          color: var(--accent); text-decoration: none; font-weight: 500;
        }

        .login-switch a:hover { text-decoration: underline; }

        /* Responsive */
        @media (max-width: 860px) {
          .login-brand { display: none; }
          .login-form-wrap { width: 100%; }
        }
      `}</style>

      <div className="login-page">

        {/* ── LEFT BRAND ── */}
        <div className="login-brand">
          <div className="brand-top">
            <Link to="/" className="brand-logo">
              <div className="brand-logo-icon">
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 13V3a1 1 0 011-1h8a1 1 0 011 1v10l-5-2.5L2 13z"
                    stroke="#C4A882" strokeWidth="1.4" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="brand-logo-text">Career<em>Launch</em></span>
            </Link>

            <h1 className="brand-headline">
              Your next role<br />starts <em>here.</em>
            </h1>
            <p className="brand-sub">
              Join thousands of professionals who've landed their dream jobs using CareerLaunch.
            </p>
          </div>

          <div className="brand-testimonial">
            <p className="testimonial-quote">
              "I built my resume in under 10 minutes and got a callback from Google the next day. Genuinely shocked."
            </p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">AK</div>
              <div>
                <div className="testimonial-name">Arjun Kapoor</div>
                <div className="testimonial-role">Software Engineer · Hired at Google</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM ── */}
        <div className="login-form-wrap">
          <div className="login-card">
            <h2 className="login-heading">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="login-subheading">
              {mode === "login"
                ? "Sign in to continue building your resume."
                : "Start building your resume for free."}
            </p>

            {/* Tabs */}
            <div className="login-tabs">
              <button
                className={`login-tab${mode === "login" ? " active" : ""}`}
                onClick={() => setMode("login")}
              >Log in</button>
              <button
                className={`login-tab${mode === "signup" ? " active" : ""}`}
                onClick={() => setMode("signup")}
              >Sign up</button>
            </div>

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="login-field">
                  <label className="login-label">Full Name</label>
                  <input className="login-input" placeholder="Jane Smith"
                    value={form.name} onChange={(e) => set("name", e.target.value)} required />
                </div>
              )}

              <div className="login-field">
                <label className="login-label">Email</label>
                <input className="login-input" type="email" placeholder="jane@email.com"
                  value={form.email} onChange={(e) => set("email", e.target.value)} required />
              </div>

              <div className="login-field">
                <label className="login-label">Password</label>
                <div className="login-input-wrap">
                  <input
                    className="login-input has-toggle"
                    type={showPass ? "text" : "password"}
                    placeholder={mode === "signup" ? "Min. 8 characters" : "Enter password"}
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    required
                  />
                  <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {mode === "login" && (
                <a href="#" className="login-forgot">Forgot password?</a>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
                {loading
                  ? <><div className="spinner" /> {mode === "login" ? "Signing in…" : "Creating account…"}</>
                  : mode === "login" ? "Sign in →" : "Create account →"
                }
              </button>
            </form>

            <div className="login-divider">
              <div className="login-divider-line" />
              <span className="login-divider-text">or continue with</span>
              <div className="login-divider-line" />
            </div>

            <button className="login-oauth">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="login-switch">
              {mode === "login"
                ? <>Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode("signup"); }}>Sign up free</a></>
                : <>Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); setMode("login"); }}>Log in</a></>
              }
            </p>
          </div>
        </div>
      </div>
    </>
  );
}