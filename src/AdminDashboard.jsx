import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";

// ── DESIGN TOKENS (matches App.jsx) ──────────────────────────────────────────
const RED       = "#B71C1C";
const RED_DARK  = "#7F0000";
const WHITE     = "#FFFFFF";
const GOLD      = "#F59E0B";
const SURFACE   = "#F4F4F6";
const TEXT      = "#111827";
const MUTED     = "#6B7280";
const BORDER    = "#E5E7EB";
const GREEN     = "#16A34A";
const GREEN_BG  = "#F0FDF4";
const RED_BG    = "#FFF0F0";
const AMBER     = "#D97706";
const AMBER_BG  = "#FFFBEB";

const FONT = "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif";

// ── TINY SVG ICONS ────────────────────────────────────────────────────────────
const PATHS = {
  car:     "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z",
  users:   "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  inquiry: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
  star:    "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  search:  "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  close:   "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  check:   "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  block:   "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  trash:   "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  shield:  "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  photo:   "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  lock:    "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  chart:   "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
  location:"M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
};

const Icon = ({ name, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={PATHS[name] || PATHS.car} />
  </svg>
);

// ── STAT CARD CONFIG ──────────────────────────────────────────────────────────
const STAT_META = [
  { icon: "car",     gradient: `linear-gradient(135deg, ${RED_DARK}, ${RED})`,      label: "Total Cars"       },
  { icon: "users",   gradient: "linear-gradient(135deg, #1D4ED8, #3B82F6)",          label: "Registered Users" },
  { icon: "inquiry", gradient: "linear-gradient(135deg, #065F46, #10B981)",          label: "Total Inquiries"  },
  { icon: "star",    gradient: `linear-gradient(135deg, #92400E, ${GOLD})`,          label: "Featured Cars"    },
];

// ── STATUS HELPERS ────────────────────────────────────────────────────────────
const statusStyle = (status) => {
  if (status === "approved") return { bg: GREEN_BG,  color: GREEN,  label: "Approved" };
  if (status === "rejected") return { bg: RED_BG,    color: RED,    label: "Rejected" };
  return                            { bg: AMBER_BG,  color: AMBER,  label: "Pending"  };
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AdminDashboard({ user, cars, setCars, deleteCar }) {
  // ── ALL ORIGINAL STATE & LOGIC (unchanged) ────────────────────────────────
  const [search,   setSearch]   = useState("");
  const [users,    setUsers]    = useState([]);
  const [contacts] = useState(JSON.parse(localStorage.getItem("contacts") || "{}"));

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (!error && data) setUsers(data);
  };

  console.log("USER:", user);

  // ── Loading / Access-denied screens (original logic, new visuals) ─────────
  if (user === null) {
    return (
      <div style={{ minHeight: "100vh", background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: RED, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={28} color={WHITE} />
          </div>
          <p style={{ fontWeight: 700, fontSize: 16, color: TEXT, margin: 0 }}>Loading dashboard…</p>
          <p style={{ color: MUTED, fontSize: 13, margin: "6px 0 0" }}>Verifying admin credentials</p>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) {
    return (
      <div style={{ minHeight: "100vh", background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
        <div style={{ textAlign: "center", padding: "0 32px" }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: RED_BG, border: `2px solid #FECACA`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="lock" size={34} color={RED} />
          </div>
          <p style={{ fontWeight: 900, fontSize: 20, color: TEXT, margin: "0 0 8px" }}>Access Denied</p>
          <p style={{ color: MUTED, fontSize: 14, margin: 0, lineHeight: 1.6 }}>You don't have admin privileges to view this page.</p>
        </div>
      </div>
    );
  }

  // ── ALL ORIGINAL FUNCTIONS (unchanged) ────────────────────────────────────
  const getUsername = (id) => {
    const u = users.find((x) => x.id === id);
    return u ? u.username : "Unknown";
  };

  const toggleFeature = async (id) => {
    const car = cars.find((c) => c.id === id);
    if (!car) return;
    const updatedFeatured = !car.featured;
    const { error } = await supabase.from("cars").update({ featured: updatedFeatured }).eq("id", id);
    if (error) { console.log(error); alert("Failed to update featured status"); return; }
    const updatedCars = cars.map((c) => c.id === id ? { ...c, featured: updatedFeatured } : c);
    setCars(updatedCars);
  };

  const updateStatus = (id, status) => {
    const updated = cars.map((c) => c.id === id ? { ...c, status } : c);
    setCars(updated);
    localStorage.setItem("cf_cars", JSON.stringify(updated));
  };

  const filtered = cars.filter(
    (c) =>
      c.carName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalInquiries = Object.values(contacts).reduce((a, b) => a + b, 0);

  const topCars = [...cars]
    .sort((a, b) => (contacts[b.id] || 0) - (contacts[a.id] || 0))
    .slice(0, 5);

  // ── STAT VALUES (unchanged) ───────────────────────────────────────────────
  const statValues = [
    cars.length,
    users.length,
    totalInquiries,
    cars.filter((c) => c.featured).length,
  ];

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: SURFACE, minHeight: "100vh", fontFamily: FONT, maxWidth: 480, margin: "0 auto" }}>

      {/* ── HEADER ── */}
      <div style={{
        background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
        padding: "16px 18px 20px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 16px rgba(127,0,0,0.3)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.2)", display: "flex" }}>
              <Icon name="shield" size={22} color={WHITE} />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>CAR-FLIX</p>
              <p style={{ color: WHITE, fontSize: 17, fontWeight: 900, margin: 0, letterSpacing: -0.3 }}>Admin Dashboard</p>
            </div>
          </div>
          {/* Admin badge */}
          <div style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 7, height: 7, borderRadius: 4, background: "#4ADE80" }} />
            <span style={{ color: WHITE, fontSize: 11, fontWeight: 700 }}>Admin</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 16px", paddingBottom: 40 }}>

        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
          {STAT_META.map((meta, i) => (
            <div key={i} style={{
              background: WHITE,
              borderRadius: 18,
              padding: "16px 16px 14px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              border: `1px solid ${BORDER}`,
              overflow: "hidden",
              position: "relative",
            }}>
              {/* Decorative circle */}
              <div style={{ position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: meta.gradient, opacity: 0.08 }} />
              <div style={{ width: 38, height: 38, borderRadius: 12, background: meta.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon name={meta.icon} size={19} color={WHITE} />
              </div>
              <p style={{ color: MUTED, fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{meta.label}</p>
              <p style={{ color: TEXT, fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -1 }}>{statValues[i]}</p>
            </div>
          ))}
        </div>

        {/* ── SEARCH BAR (WhatsApp style matching App.jsx) ── */}
        <div style={{
          background: WHITE,
          borderRadius: 14,
          border: `1px solid ${BORDER}`,
          padding: "0 14px 0 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
          boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
        }}>
          <Icon name="search" size={17} color="#8696A0" />
          <input
            placeholder="Search cars or location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              padding: "13px 0",
              border: "none",
              outline: "none",
              fontSize: 14,
              color: TEXT,
              background: "transparent",
              fontFamily: FONT,
            }}
          />
          {search.length > 0 && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
              <Icon name="close" size={16} color="#8696A0" />
            </button>
          )}
        </div>

        {/* ── SECTION LABEL ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: 0 }}>
            All Listings
          </p>
          <span style={{ background: "#F3F4F6", color: MUTED, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: "4px 12px" }}>
            {filtered.length} car{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── CAR LIST ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
              <Icon name="search" size={40} color="#E5E7EB" />
              <p style={{ marginTop: 12, fontWeight: 600 }}>No cars found</p>
            </div>
          ) : filtered.map((car) => {
            const st = statusStyle(car.status);
            return (
              <div key={car.id} style={{
                background: WHITE,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                border: `1px solid ${BORDER}`,
              }}>
                {/* ── Image row ── */}
                <div style={{ position: "relative" }}>
                  {car.images && car.images[0] ? (
                    <img src={car.images[0]} alt="" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ height: 110, background: "#F3F4F6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      <Icon name="photo" size={32} color="#D1D5DB" />
                      <span style={{ fontSize: 11, color: "#C4C4C4" }}>No photo</span>
                    </div>
                  )}
                  {/* Featured ribbon */}
                  {car.featured && (
                    <div style={{ position: "absolute", top: 10, left: 10, background: GOLD, color: WHITE, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8 }}>
                      ⭐ FEATURED
                    </div>
                  )}
                  {/* Status badge */}
                  <div style={{ position: "absolute", top: 10, right: 10, background: st.bg, color: st.color, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${st.color}33` }}>
                    {st.label}
                  </div>
                </div>

                {/* ── Info ── */}
                <div style={{ padding: "14px 16px 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.carName}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                        <Icon name="location" size={12} color={MUTED} />
                        <span style={{ color: MUTED, fontSize: 12 }}>{car.location}</span>
                      </div>
                    </div>
                    <p style={{ color: RED, fontWeight: 900, fontSize: 15, margin: 0, flexShrink: 0, marginLeft: 10 }}>
                      UGX {Number(car.price).toLocaleString()}
                    </p>
                  </div>

                  {/* Owner + Inquiries row */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 26, height: 26, borderRadius: 13, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon name="users" size={14} color={MUTED} />
                      </div>
                      <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{getUsername(car.owner_id || car.ownerId)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <Icon name="inquiry" size={13} color={MUTED} />
                      <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{contacts[car.id] || 0} inquiries</span>
                    </div>
                  </div>
                </div>

                {/* ── Action Buttons ── */}
                <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {/* Row 1: Approve / Reject */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      onClick={() => updateStatus(car.id, "approved")}
                      style={{
                        background: car.status === "approved" ? GREEN : GREEN_BG,
                        color: car.status === "approved" ? WHITE : GREEN,
                        border: `1.5px solid ${GREEN}`,
                        borderRadius: 12,
                        padding: "10px 0",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontFamily: FONT,
                      }}
                    >
                      <Icon name="check" size={15} color={car.status === "approved" ? WHITE : GREEN} />
                      Approve
                    </button>

                    <button
                      onClick={() => updateStatus(car.id, "rejected")}
                      style={{
                        background: car.status === "rejected" ? RED : RED_BG,
                        color: car.status === "rejected" ? WHITE : RED,
                        border: `1.5px solid ${RED}`,
                        borderRadius: 12,
                        padding: "10px 0",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontFamily: FONT,
                      }}
                    >
                      <Icon name="block" size={15} color={car.status === "rejected" ? WHITE : RED} />
                      Reject
                    </button>
                  </div>

                  {/* Row 2: Feature / Delete */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button
                      onClick={() => toggleFeature(car.id)}
                      style={{
                        background: car.featured ? GOLD : AMBER_BG,
                        color: car.featured ? WHITE : AMBER,
                        border: `1.5px solid ${GOLD}`,
                        borderRadius: 12,
                        padding: "10px 0",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontFamily: FONT,
                      }}
                    >
                      <Icon name="star" size={15} color={car.featured ? WHITE : AMBER} />
                      {car.featured ? "Unfeature" : "Feature"}
                    </button>

                    <button
                      onClick={() => deleteCar(car.id)}
                      style={{
                        background: "#FFF0F0",
                        color: RED,
                        border: `1.5px solid #FECACA`,
                        borderRadius: 12,
                        padding: "10px 0",
                        cursor: "pointer",
                        fontWeight: 800,
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        fontFamily: FONT,
                      }}
                    >
                      <Icon name="trash" size={15} color={RED} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ANALYTICS — Top Performing Cars ── */}
        <div style={{
          background: WHITE,
          borderRadius: 18,
          overflow: "hidden",
          boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
          border: `1px solid ${BORDER}`,
        }}>
          {/* Card header */}
          <div style={{ background: `linear-gradient(135deg, ${RED_DARK}, ${RED})`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="chart" size={20} color={WHITE} />
            <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, margin: 0 }}>Top Performing Cars</p>
          </div>

          <div style={{ padding: "14px 16px" }}>
            {topCars.length === 0 ? (
              <p style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: "16px 0" }}>No inquiry data yet</p>
            ) : topCars.map((car, i) => {
              const count  = contacts[car.id] || 0;
              const max    = contacts[topCars[0].id] || 1;
              const pct    = Math.round((count / max) * 100);
              const rankColors = ["#B71C1C", "#D97706", "#2563EB", "#6B7280", "#6B7280"];
              return (
                <div key={car.id} style={{ marginBottom: i < topCars.length - 1 ? 14 : 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {/* Rank badge */}
                      <div style={{ width: 22, height: 22, borderRadius: 11, background: rankColors[i], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: WHITE, fontSize: 10, fontWeight: 900 }}>{i + 1}</span>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{car.carName}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: rankColors[i], flexShrink: 0 }}>{count} inq.</span>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: rankColors[i], borderRadius: 3, transition: "width 0.4s ease" }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
