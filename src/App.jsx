import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";


import Navbar from "./components/Navbar";
import Sidebar from "./components/sidebar";

import Home from "./pages/home";
import Login from "./pages/login";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import AptitudeTraining from "./pages/AptitudeTraining";
import MockInterview from "./pages/MockInterview";
import GDSimulator from "./pages/GDSimulator";
import CompanyTracker from "./pages/CompanyTracker";
import OfferComparison from "./pages/OfferComparison";
import Pricing from "./pages/Pricing";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLoggedIn") === "true"
);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
  setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
}, []);

  // derive current page (used for highlighting + navbar title)
  const currentPage = location.pathname.replace("/", "") || "home";

  const isPublicPage =
    location.pathname === "/" || location.pathname === "/login";

  return (
    <div className="app-root">
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        currentPage={currentPage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {isPublicPage ? (
        // ✅ PUBLIC PAGES (NO SIDEBAR)
        <div className="main-public">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      ) : (
        // ✅ APP LAYOUT (WITH SIDEBAR)
        <div className="app-body">
          <Sidebar
            navigate={navigate}
            currentPage={currentPage}
            isOpen={sidebarOpen}
          />

          <main
            className={`main-content ${
              sidebarOpen ? "with-sidebar" : "full-width"
            }`}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/aptitude-training" element={<AptitudeTraining />} />
              <Route path="/mock-interview" element={<MockInterview />} />
              <Route path="/gd-simulator" element={<GDSimulator />} />
              <Route path="/company-tracker" element={<CompanyTracker />} />
              <Route path="/offer-comparison" element={<OfferComparison />} />
              <Route path="/pricing" element={<Pricing />} />

              {/* keep for backward compatibility */}
              <Route path="/resume" element={<ResumeBuilder />} />

              {/* fallback */}
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </main>
        </div>
      )}
    </div>
  );
}
