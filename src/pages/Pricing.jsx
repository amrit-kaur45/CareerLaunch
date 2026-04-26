import { useState } from "react";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "Forever",
    color: "#8892a4",
    icon: "🎯",
    badge: null,
    features: [
      { text: "20 aptitude questions/day", included: true },
      { text: "1 AI mock interview/month", included: true },
      { text: "Basic resume builder (1 template)", included: true },
      { text: "Resume PDF export", included: true },
      { text: "Company tracker (2 companies)", included: true },
      { text: "AI Resume Scorer", included: false },
      { text: "Unlimited aptitude practice", included: false },
      { text: "GD Simulator", included: false },
      { text: "All 3 resume templates", included: false },
      { text: "Company-wise prep tracker", included: false },
      { text: "AI Cover Letter generator", included: false },
      { text: "Offer comparison tool", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 499,
    period: "month",
    color: "#4F7EFF",
    icon: "⚡",
    badge: "Most Popular",
    features: [
      { text: "Unlimited aptitude practice", included: true },
      { text: "Unlimited AI mock interviews", included: true },
      { text: "All 3 resume templates", included: true },
      { text: "AI Resume Scorer + ATS analysis", included: true },
      { text: "Resume vs JD match", included: true },
      { text: "AI Cover Letter generator", included: true },
      { text: "GD Simulator (unlimited)", included: true },
      { text: "Company tracker (unlimited)", included: true },
      { text: "Offer comparison tool", included: true },
      { text: "Performance analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Early access to new features", included: true },
    ],
  },
  {
    id: "team",
    name: "Team / Campus",
    price: 199,
    period: "student/month",
    color: "#A855F7",
    icon: "🏫",
    badge: "For Colleges",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Batch management dashboard", included: true },
      { text: "Placement coordinator access", included: true },
      { text: "Aggregate analytics per batch", included: true },
      { text: "Company drive notifications", included: true },
      { text: "Custom company profiles", included: true },
      { text: "Bulk resume download (per batch)", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Min 10 students. Billed annually.", included: true },
      { text: "White-label option available", included: true },
      { text: "API access for LMS integration", included: true },
      { text: "SLA support guarantee", included: true },
    ],
  },
];

const TEAM_FLOW = [
  { step: 1, title: "Contact Sales", desc: "Fill in your institution details and batch size" },
  { step: 2, title: "Demo & Onboarding", desc: "Our team sets up your dashboard and imports student list" },
  { step: 3, title: "Students Get Access", desc: "Each student receives login credentials via email" },
  { step: 4, title: "Track & Report", desc: "Monitor readiness scores, attendance, and placement stats" },
];

export default function Pricing() {
  const [billing, setBilling] = useState("monthly"); // monthly | annual
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1=details, 2=payment, 3=success
  const [form, setForm] = useState({ name: "", email: "", phone: "", coupon: "" });
  const [teamForm, setTeamForm] = useState({ institute: "", coordinator: "", email: "", students: "", message: "" });
  const [teamModal, setTeamModal] = useState(false);
  const [teamSent, setTeamSent] = useState(false);

  const annualDiscount = 0.2;
  const getPrice = (plan) => {
    if (plan.price === 0) return 0;
    if (billing === "annual") return Math.round(plan.price * (1 - annualDiscount));
    return plan.price;
  };

  const openCheckout = (plan) => {
    if (plan.id === "free") return;
    if (plan.id === "team") { setTeamModal(true); return; }
    setCheckoutPlan(plan);
    setCheckoutStep(1);
    setForm({ name: "", email: "", phone: "", coupon: "" });
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1080, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: "#fff", marginBottom: 10 }}>Simple, Transparent Pricing</h1>
        <p style={{ color: "#8892a4", fontSize: 16, marginBottom: 28 }}>Start free. Upgrade when you're ready to go all-in on placement prep.</p>

        <div style={{ display: "inline-flex", background: "#161c2e", border: "1px solid #2a3450", borderRadius: 10, padding: 4 }}>
          {["monthly", "annual"].map(b => (
            <button key={b} onClick={() => setBilling(b)}
              style={{ background: billing === b ? "#4F7EFF" : "transparent", color: billing === b ? "#fff" : "#8892a4", border: "none", borderRadius: 8, padding: "8px 20px", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all .2s" }}>
              {b === "monthly" ? "Monthly" : "Annual (Save 20%)"}
            </button>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 48 }}>
        {PLANS.map(plan => (
          <div key={plan.id} style={{
            background: plan.id === "pro" ? "linear-gradient(135deg, #1e2840 0%, #1a2550 100%)" : "#161c2e",
            border: `2px solid ${plan.id === "pro" ? "#4F7EFF" : "#2a3450"}`,
            borderRadius: 20, padding: 28, position: "relative",
            boxShadow: plan.id === "pro" ? "0 0 40px #4F7EFF22" : "none",
            transition: "transform .2s"
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>

            {plan.badge && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", borderRadius: 20, padding: "4px 16px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>
                {plan.badge}
              </div>
            )}

            <div style={{ fontSize: 32, marginBottom: 12 }}>{plan.icon}</div>
            <div style={{ color: plan.color, fontSize: 13, fontWeight: 700, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.08em" }}>{plan.name}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
              <span style={{ color: "#fff", fontSize: 36, fontWeight: 800 }}>
                {plan.price === 0 ? "₹0" : `₹${getPrice(plan)}`}
              </span>
              {plan.price > 0 && <span style={{ color: "#8892a4", fontSize: 14 }}>/ {billing === "annual" ? plan.id === "team" ? "student/mo" : "mo (billed annually)" : plan.period}</span>}
            </div>
            {plan.price > 0 && billing === "annual" && (
              <div style={{ color: "#22c55e", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                You save ₹{(plan.price - getPrice(plan)) * 12}/year
              </div>
            )}
            <div style={{ color: "#8892a4", fontSize: 12, marginBottom: 20 }}>{plan.price === 0 ? "No credit card required" : plan.id === "team" ? "Minimum 10 students" : "Cancel anytime"}</div>

            <button onClick={() => openCheckout(plan)}
              style={{
                width: "100%", background: plan.price === 0 ? "transparent" : plan.color, color: plan.price === 0 ? "#8892a4" : "#fff",
                border: `1.5px solid ${plan.price === 0 ? "#2a3450" : plan.color}`, borderRadius: 10, padding: "12px 0", cursor: plan.price === 0 ? "default" : "pointer",
                fontSize: 14, fontWeight: 700, marginBottom: 24, transition: "all .2s"
              }}>
              {plan.price === 0 ? "Current Plan" : plan.id === "team" ? "Contact Sales →" : `Get ${plan.name} →`}
            </button>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.features.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <span style={{ color: f.included ? "#22c55e" : "#3a4560", fontSize: 14, flexShrink: 0, marginTop: 1 }}>{f.included ? "✓" : "✗"}</span>
                  <span style={{ color: f.included ? "#c8d0e0" : "#3a4560", fontSize: 13, lineHeight: 1.4 }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Team flow */}
      <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 20, padding: 32, marginBottom: 32 }}>
        <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 6, textAlign: "center" }}>🏫 How Team / Campus Plan Works</h3>
        <p style={{ color: "#8892a4", fontSize: 14, textAlign: "center", marginBottom: 28 }}>Colleges and training institutes can onboard entire batches in minutes</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {TEAM_FLOW.map((t, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#A855F722", border: "2px solid #A855F7", color: "#A855F7", fontWeight: 800, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>{t.step}</div>
              <div style={{ color: "#fff", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{t.title}</div>
              <div style={{ color: "#8892a4", fontSize: 13 }}>{t.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={{ textAlign: "center", color: "#8892a4", fontSize: 14 }}>
        Questions? Email us at <span style={{ color: "#4F7EFF" }}>support@careerlaunch.in</span> · 30-day money-back guarantee on Pro plan
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 20, padding: 36, width: 440, maxHeight: "90vh", overflowY: "auto" }}>
            {checkoutStep < 3 && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <div style={{ color: checkoutPlan.color, fontSize: 12, fontWeight: 700 }}>CHECKOUT</div>
                  <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>{checkoutPlan.name} Plan</div>
                </div>
                <button onClick={() => setCheckoutPlan(null)} style={{ background: "transparent", border: "none", color: "#8892a4", cursor: "pointer", fontSize: 22 }}>×</button>
              </div>
            )}

            {/* Step indicators */}
            {checkoutStep < 3 && (
              <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
                {["Details", "Payment"].map((s, i) => (
                  <div key={i} style={{ flex: 1, textAlign: "center" }}>
                    <div style={{ height: 3, background: i + 1 <= checkoutStep ? checkoutPlan.color : "#2a3450", borderRadius: 4, marginBottom: 6 }} />
                    <div style={{ color: i + 1 <= checkoutStep ? checkoutPlan.color : "#3a4560", fontSize: 12 }}>{s}</div>
                  </div>
                ))}
              </div>
            )}

            {checkoutStep === 1 && (
              <>
                {[
                  { label: "Full Name", field: "name", placeholder: "Arjun Sharma", type: "text" },
                  { label: "Email", field: "email", placeholder: "arjun@email.com", type: "email" },
                  { label: "Phone", field: "phone", placeholder: "+91 99999 99999", type: "tel" },
                  { label: "Coupon Code (optional)", field: "coupon", placeholder: "LAUNCH50", type: "text" },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: 16 }}>
                    <label style={{ color: "#8892a4", fontSize: 12, display: "block", marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                    <input type={f.type} value={form[f.field]} onChange={e => setForm(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder}
                      style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                  </div>
                ))}

                <div style={{ background: "#0f1525", border: "1px solid #2a3450", borderRadius: 10, padding: 14, marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#c8d0e0", fontSize: 13, marginBottom: 6 }}>
                    <span>{checkoutPlan.name} Plan ({billing})</span>
                    <span>₹{getPrice(checkoutPlan)}</span>
                  </div>
                  {billing === "annual" && <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e", fontSize: 12 }}><span>Annual discount (20%)</span><span>-₹{checkoutPlan.price - getPrice(checkoutPlan)}</span></div>}
                  <div style={{ borderTop: "1px solid #2a3450", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: 700 }}>
                    <span>Total</span><span>₹{getPrice(checkoutPlan)}/mo</span>
                  </div>
                </div>

                <button onClick={() => setCheckoutStep(2)} disabled={!form.name || !form.email}
                  style={{ width: "100%", background: form.name && form.email ? checkoutPlan.color : "#2a3450", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: form.name && form.email ? "pointer" : "not-allowed" }}>
                  Continue to Payment →
                </button>
              </>
            )}

            {checkoutStep === 2 && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ color: "#8892a4", fontSize: 12, display: "block", marginBottom: 6, fontWeight: 600 }}>Card Number</label>
                  <input placeholder="4242 4242 4242 4242" maxLength={19}
                    style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "monospace" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div>
                    <label style={{ color: "#8892a4", fontSize: 12, display: "block", marginBottom: 6, fontWeight: 600 }}>Expiry</label>
                    <input placeholder="MM / YY" maxLength={7}
                      style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "monospace" }} />
                  </div>
                  <div>
                    <label style={{ color: "#8892a4", fontSize: 12, display: "block", marginBottom: 6, fontWeight: 600 }}>CVV</label>
                    <input placeholder="•••" maxLength={3} type="password"
                      style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none" }} />
                  </div>
                </div>

                <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 8, padding: 12, marginBottom: 20, color: "#22c55e", fontSize: 12, display: "flex", gap: 8 }}>
                  🔒 Sandbox mode — no real charge. Use card 4242 4242 4242 4242 with any expiry/CVV.
                </div>

                <button onClick={() => setCheckoutStep(3)}
                  style={{ width: "100%", background: checkoutPlan.color, color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer", marginBottom: 10 }}>
                  Pay ₹{getPrice(checkoutPlan)} & Activate Pro →
                </button>
                <button onClick={() => setCheckoutStep(1)} style={{ width: "100%", background: "transparent", color: "#8892a4", border: "none", fontSize: 13, cursor: "pointer" }}>← Back</button>
              </>
            )}

            {checkoutStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
                <h3 style={{ color: "#fff", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>You're on Pro!</h3>
                <p style={{ color: "#8892a4", fontSize: 14, marginBottom: 4 }}>Welcome to CareerLaunch Pro, {form.name}.</p>
                <p style={{ color: "#8892a4", fontSize: 14, marginBottom: 24 }}>Receipt sent to {form.email}</p>
                <div style={{ background: "#22c55e11", border: "1px solid #22c55e33", borderRadius: 12, padding: 16, marginBottom: 24 }}>
                  <div style={{ color: "#22c55e", fontWeight: 700, fontSize: 14 }}>✓ All Pro features unlocked</div>
                  <div style={{ color: "#8892a4", fontSize: 13, marginTop: 4 }}>Unlimited interviews · GD Simulator · All templates</div>
                </div>
                <button onClick={() => setCheckoutPlan(null)}
                  style={{ background: checkoutPlan.color, color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                  Go to Dashboard →
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Team Modal */}
      {teamModal && (
        <div style={{ position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#161c2e", border: "1px solid #2a3450", borderRadius: 20, padding: 36, width: 460 }}>
            {!teamSent ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <div>
                    <div style={{ color: "#A855F7", fontSize: 12, fontWeight: 700 }}>CAMPUS PLAN</div>
                    <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Contact Sales</div>
                  </div>
                  <button onClick={() => setTeamModal(false)} style={{ background: "transparent", border: "none", color: "#8892a4", cursor: "pointer", fontSize: 22 }}>×</button>
                </div>
                {[
                  { label: "Institution Name", field: "institute", placeholder: "VIT Chennai" },
                  { label: "Placement Coordinator Name", field: "coordinator", placeholder: "Dr. Priya Menon" },
                  { label: "Official Email", field: "email", placeholder: "placement@vit.ac.in" },
                  { label: "Number of Students", field: "students", placeholder: "250" },
                  { label: "Message / Requirement", field: "message", placeholder: "We want to onboard 2025 batch for placement prep..." },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: 14 }}>
                    <label style={{ color: "#8892a4", fontSize: 12, display: "block", marginBottom: 6, fontWeight: 600 }}>{f.label}</label>
                    {f.field === "message"
                      ? <textarea value={teamForm[f.field]} onChange={e => setTeamForm(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder} rows={3}
                          style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "none" }} />
                      : <input value={teamForm[f.field]} onChange={e => setTeamForm(p => ({ ...p, [f.field]: e.target.value }))} placeholder={f.placeholder}
                          style={{ width: "100%", background: "#0f1525", border: "1px solid #2a3450", borderRadius: 8, padding: "10px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
                    }
                  </div>
                ))}
                <button onClick={() => setTeamSent(true)}
                  style={{ width: "100%", background: "#A855F7", color: "#fff", border: "none", borderRadius: 10, padding: "13px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Submit Enquiry →
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📩</div>
                <h3 style={{ color: "#fff", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Enquiry Received!</h3>
                <p style={{ color: "#8892a4", fontSize: 14, marginBottom: 24 }}>Our team will reach out to {teamForm.email} within 24 hours to schedule a demo.</p>
                <button onClick={() => { setTeamModal(false); setTeamSent(false); }} style={{ background: "#A855F7", color: "#fff", border: "none", borderRadius: 10, padding: "10px 28px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}