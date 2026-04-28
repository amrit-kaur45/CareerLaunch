import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({
  isLoggedIn,
  setIsLoggedIn,
  currentPage,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  setIsLoggedIn(false);
  navigate("/login");
};

  return (
    <header className="navbar">
      {/* LEFT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {isLoggedIn && (
          <button
            onClick={() => setSidebarOpen?.((p) => !p)}
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

        {/* LOGO */}
        <div
          className="navbar-logo"
          onClick={() => navigate(isLoggedIn ? "/dashboard" : "/")}
        >
          <span>🚀</span>
          <span>Career</span>
          <span
            style={{
              fontFamily: "inherit",
              background: "none",
              WebkitTextFillColor: "var(--text)",
            }}
          >
            Launch
          </span>
        </div>
      </div>

      {/* CENTER */}
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

      {/* RIGHT */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {!isLoggedIn ? (
          <>
            <button
              onClick={() => navigate("/pricing")}
              style={{
                background: "transparent",
                border: "none",
                color: "#8892a4",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Pricing
            </button>

            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: "1px solid #2a3450",
                color: "#c8d0e0",
                borderRadius: 8,
                padding: "8px 18px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setIsLoggedIn(true);
                navigate("/dashboard");
              }}
              style={{
                background: "#4F7EFF",
                border: "none",
                color: "#fff",
                borderRadius: 8,
                padding: "8px 18px",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              Get Started →
            </button>
          </>
        ) : (
          <>
            {/* Notification */}
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "#8892a4",
                cursor: "pointer",
                fontSize: 18,
                position: "relative",
              }}
            >
              🔔
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: 7,
                  height: 7,
                  background: "#ef4444",
                  borderRadius: "50%",
                  border: "1px solid #080D1A",
                }}
              />
            </button>

            {/* Profile */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setProfileOpen((p) => !p)}
                style={{
                  background: "transparent",
                  border: "1px solid #2a3450",
                  color: "#c8d0e0",
                  borderRadius: 8,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Profile
              </button>

              {profileOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "110%",
                    background: "#111827",
                    border: "1px solid #2a3450",
                    borderRadius: 10,
                    padding: 6,
                    minWidth: 180,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    zIndex: 100,
                  }}
                >
                  {[
                    { label: "🏠 Dashboard", action: () => navigate("/dashboard") },
                    { label: "⚡ Upgrade to Pro", action: () => navigate("/pricing") },
                    { label: "⚙️ Settings", action: () => {} },
                    { label: "🚪 Sign Out", action: handleLogout, danger: true },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        item.action();
                        setProfileOpen(false);
                      }}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: item.danger ? "#ef4444" : "#c8d0e0",
                        textAlign: "left",
                        padding: "8px 10px",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontSize: 13,
                      }}
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