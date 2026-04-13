import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Google Font ───────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
fontLink.rel = "stylesheet";
document.head.appendChild(fontLink);

const styleTag = document.createElement("style");
styleTag.innerHTML = `* { font-family: 'Poppins', sans-serif; box-sizing: border-box; } body { margin: 0; background: #f0f4f3; }`;
document.head.appendChild(styleTag);

// ─── Friends Data ──────────────────────────────────────────────────────────────
const INITIAL_FRIENDS = [
  {
    id: 1,
    name: "Sarah Chen",
    picture: "https://i.pravatar.cc/150?img=47",
    email: "sarah.chen@gmail.com",
    days_since_contact: 8,
    status: "on-track",
    tags: ["college", "close friend"],
    bio: "Met during freshman orientation. We bonded over late-night study sessions and bad campus food. She's now a UX designer in NYC.",
    goal: 14,
    next_due_date: "2025-07-20",
  },
  {
    id: 2,
    name: "Marcus Johnson",
    picture: "https://i.pravatar.cc/150?img=12",
    email: "marcus.j@outlook.com",
    days_since_contact: 32,
    status: "overdue",
    tags: ["work", "mentor"],
    bio: "My first manager at the startup. Taught me everything about shipping products fast. Still my go-to for career advice.",
    goal: 21,
    next_due_date: "2025-06-15",
  },
  {
    id: 3,
    name: "Aisha Patel",
    picture: "https://i.pravatar.cc/150?img=32",
    email: "aisha.patel@yahoo.com",
    days_since_contact: 11,
    status: "almost due",
    tags: ["family", "neighbor"],
    bio: "Grew up next door to each other. Our families spent every summer holiday together. She moved to London but we video call every few weeks.",
    goal: 14,
    next_due_date: "2025-07-05",
  },
  {
    id: 4,
    name: "Tom Baker",
    picture: "https://i.pravatar.cc/150?img=68",
    email: "tombaker@proton.me",
    days_since_contact: 45,
    status: "overdue",
    tags: ["hobby", "travel"],
    bio: "Trail running buddy from the weekend hiking club. We completed a 50k ultramarathon together last spring. Pure grit, this guy.",
    goal: 30,
    next_due_date: "2025-05-30",
  },
  {
    id: 5,
    name: "Olivia Martinez",
    picture: "https://i.pravatar.cc/150?img=56",
    email: "olivia.m@gmail.com",
    days_since_contact: 5,
    status: "on-track",
    tags: ["college", "work"],
    bio: "We interned at the same company and became fast friends. She's sharp, ambitious, and makes the best tamales I've ever tasted.",
    goal: 14,
    next_due_date: "2025-07-18",
  },
  {
    id: 6,
    name: "Ryan O'Brien",
    picture: "https://i.pravatar.cc/150?img=53",
    email: "ryan.obrien@icloud.com",
    days_since_contact: 19,
    status: "almost due",
    tags: ["close friend", "hobby"],
    bio: "Childhood best friend. We learned guitar together in middle school. He's still playing in a band on weekends while working as an engineer.",
    goal: 21,
    next_due_date: "2025-07-02",
  },
  {
    id: 7,
    name: "Priya Nair",
    picture: "https://i.pravatar.cc/150?img=41",
    email: "priya.nair@gmail.com",
    days_since_contact: 3,
    status: "on-track",
    tags: ["work", "close friend"],
    bio: "Met at a product conference in Berlin. We stayed in touch and now regularly swap book recommendations and startup ideas over coffee calls.",
    goal: 14,
    next_due_date: "2025-07-22",
  },
  {
    id: 8,
    name: "James Okafor",
    picture: "https://i.pravatar.cc/150?img=15",
    email: "james.okafor@hotmail.com",
    days_since_contact: 60,
    status: "overdue",
    tags: ["family", "college"],
    bio: "Cousin who I basically grew up with. We drifted after he moved abroad for his PhD but I always feel like no time has passed when we reconnect.",
    goal: 30,
    next_due_date: "2025-04-10",
  },
];

// ─── Initial Timeline ──────────────────────────────────────────────────────────
const INITIAL_TIMELINE = [
  { id: 101, friendId: 4, type: "Meetup", title: "Meetup with Tom Baker", date: "2026-03-29" },
  { id: 102, friendId: 1, type: "Text", title: "Text with Sarah Chen", date: "2026-03-28" },
  { id: 103, friendId: 5, type: "Meetup", title: "Meetup with Olivia Martinez", date: "2026-03-26" },
  { id: 104, friendId: 3, type: "Video", title: "Video with Aisha Patel", date: "2026-03-23" },
  { id: 105, friendId: 1, type: "Meetup", title: "Meetup with Sarah Chen", date: "2026-03-21" },
  { id: 106, friendId: 2, type: "Call", title: "Call with Marcus Johnson", date: "2026-03-19" },
  { id: 107, friendId: 3, type: "Meetup", title: "Meetup with Aisha Patel", date: "2026-03-17" },
  { id: 108, friendId: 5, type: "Text", title: "Text with Olivia Martinez", date: "2026-03-13" },
  { id: 109, friendId: 8, type: "Call", title: "Call with James Okafor", date: "2026-03-11" },
  { id: 110, friendId: 1, type: "Call", title: "Call with Sarah Chen", date: "2026-03-11" },
  { id: 111, friendId: 2, type: "Video", title: "Video with Marcus Johnson", date: "2026-03-06" },
  { id: 112, friendId: 6, type: "Video", title: "Video with Ryan O'Brien", date: "2026-02-24" },
];

// ─── Colors ────────────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#1e4d3f",
  primaryLight: "#2d6e5a",
  bg: "#f0f4f3",
  card: "#ffffff",
  text: "#1a2e2a",
  muted: "#6b8278",
  overdue: "#ef4444",
  almostDue: "#f59e0b",
  onTrack: "#10b981",
  overdueLight: "#fee2e2",
  almostDueLight: "#fef3c7",
  onTrackLight: "#d1fae5",
};

function statusColor(status) {
  if (status === "overdue") return { bg: COLORS.overdue, text: "#fff" };
  if (status === "almost due") return { bg: COLORS.almostDue, text: "#fff" };
  return { bg: COLORS.onTrack, text: "#fff" };
}

function statusLabel(status) {
  if (status === "overdue") return "Overdue";
  if (status === "almost due") return "Almost Due";
  return "On-Track";
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background: COLORS.primary,
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 500,
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "slideIn 0.3s ease",
          }}
        >
          <span>{t.icon}</span>
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", marginLeft: 8, fontSize: 16 }}>×</button>
        </div>
      ))}
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </div>
  );
}

// ─── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/timeline", label: "Timeline", icon: "🕐" },
    { to: "/stats", label: "Stats", icon: "📈" },
  ];

  return (
    <nav style={{
      background: "#fff",
      borderBottom: "1px solid #e5ede9",
      padding: "0 32px",
      height: 64,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.text }}>
          <span style={{ fontWeight: 400 }}>Keen</span>Keeper
        </span>
      </Link>

      {/* Desktop nav */}
      <div style={{ display: "flex", gap: 4, alignItems: "center" }} className="desktop-nav">
        {links.map((l) => {
          const active = location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to));
          return (
            <Link
              key={l.to}
              to={l.to}
              style={{
                textDecoration: "none",
                padding: "8px 16px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                background: active ? COLORS.primary : "transparent",
                color: active ? "#fff" : COLORS.text,
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: 14 }}>{l.icon}</span> {l.label}
            </Link>
          );
        })}
      </div>

      {/* Hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: 24 }}
        className="hamburger"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, background: "#fff",
          borderBottom: "1px solid #e5ede9", padding: 16, display: "flex", flexDirection: "column", gap: 4,
          zIndex: 99,
        }} className="mobile-menu">
          {links.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                style={{
                  textDecoration: "none", padding: "12px 16px", borderRadius: 8,
                  display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: active ? 600 : 400,
                  background: active ? COLORS.primary : "#f0f4f3", color: active ? "#fff" : COLORS.text,
                }}
              >
                <span>{l.icon}</span>{l.label}
              </Link>
            );
          })}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </nav>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: COLORS.primary, color: "#fff", padding: "60px 32px 24px", textAlign: "center" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <h2 style={{ fontSize: 42, fontWeight: 800, margin: "0 0 16px" }}>KeenKeeper</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: "0 0 32px" }}>
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>
        <p style={{ fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>Social Links</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          {["📷", "📘", "✕"].map((icon, i) => (
            <button key={i} style={{
              width: 44, height: 44, borderRadius: "50%", background: "#fff",
              border: "none", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{icon}</button>
          ))}
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 13, color: "rgba(255,255,255,0.6)" }}>
          <span>© 2026 KeenKeeper. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy Policy", "Terms of Service", "Cookies"].map((t) => (
              <a key={t} href="#" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({ friends, loading }) {
  const navigate = useNavigate();

  const total = friends.length;
  const onTrack = friends.filter((f) => f.status === "on-track").length;
  const needAttention = friends.filter((f) => f.status !== "on-track").length;

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
        <div style={{
          width: 48, height: 48, border: `4px solid ${COLORS.primaryLight}`,
          borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: COLORS.muted, fontWeight: 500 }}>Loading your friends…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Banner */}
      <div style={{ background: COLORS.bg, padding: "64px 32px 40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: COLORS.text, margin: "0 0 16px" }}>
          Friends to keep close in your life
        </h1>
        <p style={{ color: COLORS.muted, fontSize: 16, margin: "0 0 32px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
          Your personal shelf of meaningful connections. Browse, tend, and nurture the relationships that matter most.
        </p>
        <button
          onClick={() => alert("Add a Friend — coming soon!")}
          style={{
            background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10,
            padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>+</span> Add a Friend
        </button>

        {/* Summary cards */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 16, maxWidth: 900, margin: "40px auto 0",
        }}>
          {[
            { value: total, label: "Total Friends" },
            { value: onTrack, label: "On Track" },
            { value: needAttention, label: "Need Attention" },
            { value: 12, label: "Interactions This Month" },
          ].map((c) => (
            <div key={c.label} style={{ background: "#fff", borderRadius: 12, padding: "24px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: COLORS.text }}>{c.value}</div>
              <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 4 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Friends Grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 32px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, marginBottom: 24 }}>Your Friends</h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {friends.map((f) => {
            const sc = statusColor(f.status);
            return (
              <div
                key={f.id}
                onClick={() => navigate(`/friend/${f.id}`)}
                style={{
                  background: "#fff", borderRadius: 12, padding: "24px 16px",
                  textAlign: "center", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  border: "1px solid #e8f0ec", transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)"; }}
              >
                <img src={f.picture} alt={f.name} style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} />
                <div style={{ fontWeight: 600, fontSize: 15, color: COLORS.text }}>{f.name}</div>
                <div style={{ fontSize: 12, color: COLORS.muted, margin: "4px 0 10px" }}>{f.days_since_contact}d ago</div>
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 10 }}>
                  {f.tags.map((t) => (
                    <span key={t} style={{ background: "#f0f4f3", color: COLORS.muted, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: 0.5 }}>{t}</span>
                  ))}
                </div>
                <span style={{ background: sc.bg, color: sc.text, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                  {statusLabel(f.status)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Friend Detail Page ────────────────────────────────────────────────────────
function FriendDetailPage({ friends, timeline, addTimelineEntry, addToast }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const friend = friends.find((f) => f.id === parseInt(id));

  if (!friend) return <NotFoundPage />;

  const sc = statusColor(friend.status);
  const friendTimeline = timeline.filter((e) => e.friendId === friend.id);

  const handleCheckIn = (type) => {
    const entry = {
      id: Date.now(),
      friendId: friend.id,
      type,
      title: `${type} with ${friend.name}`,
      date: new Date().toISOString().split("T")[0],
    };
    addTimelineEntry(entry);
    const icons = { Call: "📞", Text: "💬", Video: "🎥" };
    addToast({ icon: icons[type], message: `${type} with ${friend.name} logged!` });
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", cursor: "pointer", color: COLORS.muted, fontSize: 14, marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
        ← Back
      </button>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20 }} className="detail-grid">
        {/* Left column */}
        <div>
          {/* Profile card */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "28px 20px", textAlign: "center", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <img src={friend.picture} alt={friend.name} style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }} />
            <div style={{ fontWeight: 700, fontSize: 18, color: COLORS.text, marginBottom: 8 }}>{friend.name}</div>
            <span style={{ background: sc.bg, color: sc.text, fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, display: "inline-block", marginBottom: 8 }}>
              {statusLabel(friend.status)}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 12 }}>
              {friend.tags.map((t) => (
                <span key={t} style={{ background: "#e8f5f0", color: COLORS.primary, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 20, textTransform: "uppercase" }}>{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: COLORS.muted, fontStyle: "italic", margin: "0 0 8px" }}>"{friend.bio}"</p>
            <p style={{ fontSize: 13, color: COLORS.muted, margin: 0 }}>Preferred: {friend.email}</p>
          </div>

          {/* Action buttons */}
          {[
            { icon: "⏰", label: "Snooze 2 Weeks", color: COLORS.text },
            { icon: "📦", label: "Archive", color: COLORS.text },
            { icon: "🗑️", label: "Delete", color: COLORS.overdue },
          ].map((btn) => (
            <button key={btn.label} style={{
              width: "100%", background: "#fff", border: "1px solid #e8f0ec", borderRadius: 10,
              padding: "14px 16px", marginBottom: 8, cursor: "pointer", display: "flex", alignItems: "center",
              gap: 10, fontSize: 14, fontWeight: 500, color: btn.color,
            }}>
              {btn.icon} {btn.label}
            </button>
          ))}
        </div>

        {/* Right column */}
        <div>
          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { value: friend.days_since_contact, label: "Days Since Contact" },
              { value: friend.goal, label: "Goal (Days)" },
              { value: new Date(friend.next_due_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), label: "Next Due" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "24px 16px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.text }}>{s.value}</div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Relationship goal */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontWeight: 600, fontSize: 16, color: COLORS.text }}>Relationship Goal</span>
              <button style={{ background: "#fff", border: "1px solid #d0ddd8", borderRadius: 6, padding: "5px 14px", fontSize: 13, cursor: "pointer", color: COLORS.text, fontWeight: 500 }}>Edit</button>
            </div>
            <p style={{ color: COLORS.muted, margin: 0, fontSize: 15 }}>
              Connect every <strong style={{ color: COLORS.text }}>{friend.goal} days</strong>
            </p>
          </div>

          {/* Quick Check-In */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", marginBottom: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ fontWeight: 600, fontSize: 16, color: COLORS.text, marginBottom: 16 }}>Quick Check-In</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              {[
                { type: "Call", icon: "📞" },
                { type: "Text", icon: "💬" },
                { type: "Video", icon: "🎥" },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleCheckIn(btn.type)}
                  style={{
                    background: "#fff", border: "1px solid #e0ebe5", borderRadius: 10,
                    padding: "16px 8px", cursor: "pointer", display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 8, fontSize: 14, fontWeight: 500, color: COLORS.text,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#f0f4f3"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                >
                  <span style={{ fontSize: 24 }}>{btn.icon}</span>
                  {btn.type}
                </button>
              ))}
            </div>
          </div>

          {/* Recent Interactions */}
          <div style={{ background: "#fff", borderRadius: 12, padding: "20px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontWeight: 600, fontSize: 16, color: COLORS.text }}>Recent Interactions</span>
              <Link to="/timeline" style={{ color: COLORS.primary, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>🕐 Full History</Link>
            </div>
            {friendTimeline.length === 0 ? (
              <p style={{ color: COLORS.muted, fontSize: 14 }}>No interactions yet. Use Quick Check-In above!</p>
            ) : (
              friendTimeline.slice(0, 5).map((e, i) => (
                <div key={e.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderTop: i > 0 ? "1px solid #f0f4f3" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20 }}>
                      {e.type === "Call" ? "📞" : e.type === "Text" ? "💬" : e.type === "Video" ? "🎥" : "🤝"}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: COLORS.text }}>{e.type}</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{e.title.split(" with ")[1] || ""}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.muted }}>
                    {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Timeline Page ─────────────────────────────────────────────────────────────
function TimelinePage({ timeline }) {
  const [filter, setFilter] = useState("All");
  const types = ["All", "Call", "Text", "Video", "Meetup"];
  const typeIcon = { Call: "📞", Text: "💬", Video: "🎥", Meetup: "🤝" };

  const filtered = filter === "All" ? timeline : timeline.filter((e) => e.type === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, marginBottom: 24 }}>Timeline</h1>

      {/* Filter */}
      <div style={{ marginBottom: 24, position: "relative", maxWidth: 280 }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            width: "100%", padding: "10px 36px 10px 14px", border: "1px solid #d0ddd8",
            borderRadius: 8, fontSize: 14, color: COLORS.text, background: "#fff",
            appearance: "none", cursor: "pointer", outline: "none",
          }}
        >
          {types.map((t) => <option key={t}>{t}</option>)}
        </select>
        <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: COLORS.muted }}>▾</span>
      </div>

      {/* Entries */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {sorted.length === 0 ? (
          <p style={{ color: COLORS.muted }}>No entries found.</p>
        ) : (
          sorted.map((e) => (
            <div key={e.id} style={{
              background: "#fff", borderRadius: 10, padding: "16px 20px",
              display: "flex", alignItems: "center", gap: 16,
              border: "1px solid #eef2f0",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0f4f3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {typeIcon[e.type] || "📌"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, color: COLORS.text }}>
                  <strong>{e.type}</strong>{" "}
                  <span style={{ color: COLORS.muted, fontWeight: 400 }}>
                    with {e.title.replace(`${e.type} with `, "")}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
                  {new Date(e.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Stats Page ────────────────────────────────────────────────────────────────
function StatsPage({ timeline }) {
  const counts = { Call: 0, Text: 0, Video: 0 };
  timeline.forEach((e) => { if (counts[e.type] !== undefined) counts[e.type]++; });
  const data = [
    { name: "Text", value: counts.Text },
    { name: "Call", value: counts.Call },
    { name: "Video", value: counts.Video },
  ].filter((d) => d.value > 0);

  const PIE_COLORS = ["#8b5cf6", "#1e4d3f", "#22c55e"];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: COLORS.text, marginBottom: 28 }}>Friendship Analytics</h1>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: 15, color: COLORS.muted, marginBottom: 24, fontWeight: 500 }}>By Interaction Type</p>
        <ResponsiveContainer width="100%" height={340}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={140}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── 404 Page ──────────────────────────────────────────────────────────────────
function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, textAlign: "center", padding: 32 }}>
      <div style={{ fontSize: 80 }}>🌿</div>
      <h1 style={{ fontSize: 64, fontWeight: 800, color: COLORS.primary, margin: 0 }}>404</h1>
      <p style={{ fontSize: 20, color: COLORS.text, fontWeight: 600 }}>Page not found</p>
      <p style={{ color: COLORS.muted, maxWidth: 360 }}>This page seems to have wandered off. Let's get you back to your connections.</p>
      <button
        onClick={() => navigate("/")}
        style={{ background: COLORS.primary, color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
      >
        ← Back to Home
      </button>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState(INITIAL_TIMELINE);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFriends(INITIAL_FRIENDS);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const addTimelineEntry = useCallback((entry) => {
    setTimeline((prev) => [entry, ...prev]);
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <Router>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: COLORS.bg }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage friends={friends} loading={loading} />} />
            <Route
              path="/friend/:id"
              element={
                <FriendDetailPage
                  friends={friends}
                  timeline={timeline}
                  addTimelineEntry={addTimelineEntry}
                  addToast={addToast}
                />
              }
            />
            <Route path="/timeline" element={<TimelinePage timeline={timeline} />} />
            <Route path="/stats" element={<StatsPage timeline={timeline} />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
        <Toast toasts={toasts} removeToast={removeToast} />
      </div>
    </Router>
  );
}
