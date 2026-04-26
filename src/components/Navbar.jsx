import { useState } from "react";

export default function Navbar({ navigate, isLoggedIn, setIsLoggedIn, currentPage, sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileOpen(false);
    navigate("home");
  };

  return (
    <header className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isLoggedIn && (
          <button
            onClick={() => setSidebarOpen?.(p => !p)}
            style={{
              background: "transparent",
              border: "none",
              color: "#8892a4",
              cursor: "pointer",
              fontSize: 18,
              padding: "4px 6px",
              borderRadius: 6,
              lineHeight: 1,
            }}
          >
            ☰
          </button>
        )}
        <div className="navbar-logo" onClick={() => navigate(isLoggedIn ? "dashboard" : "home")}>
          <span>🚀</span>
          <span>Career</span><span style={{ fontFamily: "inherit", background: "none", WebkitTextFillColor: "var(--text)" }}>Launch</span>
        </div>
      </div>

      {/* Center: page title on logged-in pages */}
      {isLoggedIn && (
        <div style={{ color: "#8892a4", fontSize: 13 }}>
          {{
            "dashboard": "Dashboard",
            "resume-builder": "Resume Builder",
            "ai-analyzer": "AI Resume Analyser",
            "aptitude": "Aptitude Training",
            "mock-interview": "Mock Interview",
            "gd-simulator": "GD Simulator",
            "company-tracker": "Company Tracker",
            "offer-comparison": "Offer Comparison",
            "pricing": "Plans & Pricing",
          }[currentPage] || ""}
        </div>
      )}

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("pricing")}
              style={{ background: "transparent", border: "none", color: "#8892a4", cursor: "pointer", fontSize: 14, fontWeight: 500 }}
            >
              Pricing
            </button>
            <button
              onClick={() => navigate("login")}
              style={{ background: "transparent", border: "1px solid #2a3450", color: "#c8d0e0", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoggedIn(true); navigate("dashboard"); }}
              style={{ background: "#4F7EFF", border: "none", color: "#fff", borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}
            >
              Get Started →
            </button>
          </>
        ) : (
          <>
            {/* Notifications */}
            <button style={{ background: "transparent", border: "none", color: "#8892a4", cursor: "pointer", fontSize: 18, position: "relative" }}>
              🔔
              <span style={{ position: "absolute", top: 0, right: 0, width: 7, height: 7, background: "#ef4444", borderRadius: "50%", border: "1px solid #080D1A" }} />
            </button>

            {/* Profile */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen(p => !p)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#161c2e", border: "1px solid #2a3450",
                  borderRadius: 10, padding: "6px 12px", cursor: "pointer",
                }}
              >
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #4F7EFF, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700 }}>A</div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, lineHeight: 1.2 }}>Arjun Sharma</div>
                  <div style={{ color: "#8892a4", fontSize: 11 }}>Free Plan</div>
                </div>
                <span style={{ color: "#8892a4", fontSize: 12 }}>▾</span>
              </button>

              {profileOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#161c2e", border: "1px solid #2a3450", borderRadius: 12,
                  padding: 8, minWidth: 200, zIndex: 200,
                  boxShadow: "0 8px 32px rgba(0,0,0,.4)",
                }}>
                  {[
                    { label: "🏠 Dashboard", action: () => navigate("dashboard") },
                    { label: "⚡ Upgrade to Pro", action: () => navigate("pricing") },
                    { label: "⚙️ Settings", action: () => {} },
                    { label: "🚪 Sign Out", action: handleLogout, danger: true },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => { item.action(); setProfileOpen(false); }}
                      style={{
                        display: "block", width: "100%", background: "transparent",
                        border: "none", color: item.danger ? "#ef4444" : "#c8d0e0",
                        padding: "9px 14px", textAlign: "left", cursor: "pointer",
                        borderRadius: 8, fontSize: 13, fontWeight: 500,
                        transition: "background .1s",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#1e2840"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}