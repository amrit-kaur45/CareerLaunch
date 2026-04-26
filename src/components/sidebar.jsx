import { useState } from "react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [
      { id: "dashboard", icon: "🏠", label: "Dashboard" },
    ],
  },
  {
    label: "Resume",
    items: [
      { id: "resume-builder", icon: "📄", label: "Resume Builder" },
      { id: "ai-analyzer", icon: "🔍", label: "AI Analyser", badge: "AI" },
    ],
  },
  {
    label: "Practice",
    items: [
      { id: "aptitude", icon: "📐", label: "Aptitude Training" },
      { id: "mock-interview", icon: "🎙️", label: "Mock Interview", badge: "AI" },
      { id: "gd-simulator", icon: "🗣️", label: "GD Simulator", badge: "AI" },
    ],
  },
  {
    label: "Placement",
    items: [
      { id: "company-tracker", icon: "🏢", label: "Company Tracker" },
      { id: "offer-comparison", icon: "⚖️", label: "Offer Comparison" },
    ],
  },
  {
    label: "Account",
    items: [
      { id: "pricing", icon: "⚡", label: "Upgrade to Pro" },
    ],
  },
];

export default function Sidebar({ navigate, currentPage, isOpen }) {
  const [streakDays] = useState(4);

  return (
    <aside className={`sidebar ${isOpen ? "" : "closed"}`}>
      {/* Streak */}
      <div style={{
        margin: "12px 8px",
        background: "linear-gradient(135deg, #1a1f38, #1e2545)",
        border: "1px solid #2a3450",
        borderRadius: 10,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{ fontSize: 22 }}>🔥</div>
        <div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{streakDays} Day Streak</div>
          <div style={{ color: "#8892a4", fontSize: 11 }}>Keep it going!</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {NAV_SECTIONS.map(section => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${currentPage === item.id ? "active" : ""}`}
                onClick={() => navigate(item.id)}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="sidebar-badge">{item.badge}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Pro CTA at bottom */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid #1a2340", marginTop: "auto" }}>
        <div style={{
          background: "linear-gradient(135deg, #1e2a5e 0%, #2a1a5e 100%)",
          border: "1px solid #3a3880",
          borderRadius: 10,
          padding: "12px 14px",
          cursor: "pointer",
        }} onClick={() => navigate("pricing")}>
          <div style={{ color: "#a78bfa", fontSize: 11, fontWeight: 700, marginBottom: 4 }}>FREE PLAN</div>
          <div style={{ color: "#fff", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Unlock all features</div>
          <div style={{
            background: "linear-gradient(90deg, #4F7EFF, #a855f7)",
            borderRadius: 7,
            padding: "7px 0",
            textAlign: "center",
            color: "#fff",
            fontSize: 12,
            fontWeight: 700,
          }}>
            Upgrade to Pro →
          </div>
        </div>
      </div>
    </aside>
  );
}