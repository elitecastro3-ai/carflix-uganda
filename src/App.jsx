import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { supabase } from "./supabase";
// ── MOCK DATA ──────────────────────────────────────────────────────────────────
const MOCK_CARS = [
  { id: "1", carName: "Noah", brand: "Toyota", price: 45000000, location: "Nakawa", condition: "Used", description: "Well maintained Toyota Noah, 7-seater, fuel efficient. Excellent condition for family use.", images: ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400&q=80"], ownerId: "u1", badge: "New", featured: false },
  { id: "2", carName: "Land Cruiser Prado 2019", brand: "Toyota", price: 90000000, location: "Kampala", condition: "Used", description: "Toyota Prado 2019 in pristine condition. Full service history, low mileage.", images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80"], ownerId: "u1", badge: "New", featured: false },
  { id: "3", carName: "Land Cruiser Prado 2019", brand: "Toyota", price: 95000000, location: "Entebbe", condition: "Used", description: "Toyota Prado V8 diesel, sunroof, leather seats. Ready to go.", images: [], ownerId: "u2", badge: null, featured: true },
  { id: "4", carName: "C-Class 2021", brand: "Mercedes-Benz", price: 130000000, location: "Kololo", condition: "Foreign Used", description: "Mercedes-Benz C-Class 2021, imported directly from Germany. Top spec.", images: [], ownerId: "u2", badge: null, featured: true },
  { id: "5", carName: "X5 2020", brand: "BMW", price: 180000000, location: "Kampala", condition: "Foreign Used", description: "BMW X5 xDrive40i, panoramic roof, HUD, 360 cameras.", images: ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80"], ownerId: "u3", badge: null, featured: false },
  { id: "6", carName: "Harrier 2018", brand: "Toyota", price: 62000000, location: "Ntinda", condition: "Used", description: "Toyota Harrier 2018, sunroof, push start, leather seats.", images: ["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&q=80"], ownerId: "u3", badge: null, featured: false },
  { id: "7", carName: "Nissan X-Trail 2017", brand: "Nissan", price: 55000000, location: "Kampala", condition: "Used", description: "Nissan X-Trail 2017, 4WD, well maintained, one owner.", images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80"], ownerId: "u1", badge: null, featured: false },
  { id: "8", carName: "GLC 300 2020", brand: "Mercedes-Benz", price: 210000000, location: "Kampala", condition: "Foreign Used", description: "Mercedes GLC 300 2020 AMG line, warranty available.", images: ["https://images.unsplash.com/photo-1617788138017-80ad40651399?w=400&q=80"], ownerId: "u2", badge: null, featured: false },
];

const BRANDS = ["All", "Toyota", "Mercedes-Benz", "BMW", "Nissan", "Honda", "Subaru"];
const CONDITIONS = ["Any Condition", "New", "Used", "Foreign Used", "Local Used"];
const WA_NUMBERS = [
  { label: "CAR-FLIX Line 1", number: "256708866140", display: "0708 866 140" },
  { label: "CAR-FLIX Line 2", number: "256747147277", display: "0747 147 277" },
  { label: "CAR-FLIX Line 3", number: "256706018343", display: "0706 018 343" },
];

const formatPrice = (p) => "UGX " + p.toLocaleString();

// ── FIREBASE SIMULATION (localStorage) ────────────────────────────────────────
6

// ── ICONS ──────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const paths = {
    home: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z",
    heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    "heart-outline": "M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z",
    lock: "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
    info: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z",
    search: "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
    eye: "M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z",
    admin: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
    plus: "M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    close: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
    delete: "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    back: "M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z",
    whatsapp: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z",
    location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    photo: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
    filter: "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d={paths[name] || paths.info} />
    </svg>
  );
};

// ── COLORS ─────────────────────────────────────────────────────────────────────
const RED = "#B71C1C";
const RED_DARK = "#7F0000";
const RED_LIGHT = "#EF5350";
const WHITE = "#FFFFFF";

// ── STYLES ─────────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Segoe UI', sans-serif", background: "#F5F5F5", minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative", paddingBottom: 80 },
  header: { background: RED, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: { background: WHITE, borderRadius: 10, padding: "6px 8px", display: "flex", alignItems: "center", justifyContent: "center" },
  logoText: { color: WHITE, fontWeight: 800, fontSize: 20, letterSpacing: 1 },
  logoSub: { color: "rgba(255,255,255,0.7)", fontSize: 10, letterSpacing: 2 },
  headerIcons: { display: "flex", gap: 12, alignItems: "center" },
  iconBtn: { background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", color: WHITE },
  searchBar: { background: RED_DARK, padding: "12px 16px 16px" },
  searchRow: {
  display: "flex",
  gap: 8,
  alignItems: "center",
},
  searchInput: {
  
  padding: "12px 12px 12px 40px",
  borderRadius: 10,
  border: "1px solid #E0E0E0",
  outline: "none",

  // 🔥 FIXES
  color: "#1A1A1A",      // visible text
  background: "#FFFFFF", // clean background
},
  searchBtn: { background: RED_LIGHT, color: WHITE, border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, fontSize: 14, cursor: "pointer", flexShrink: 0, },
  filterRow: { display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 2 },
  filterChip: (active) => ({ background: active ? WHITE : "rgba(255,255,255,0.18)", color: active ? RED : WHITE, border: active ? "none" : "1.5px solid rgba(255,255,255,0.4)", borderRadius: 20, padding: "6px 14px", fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }),
  section: { padding: "14px 16px 0" },
  sectionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontWeight: 800, fontSize: 18, color: "#1A1A1A" },
  browseAll: { color: RED, fontSize: 13, fontWeight: 600, cursor: "pointer", background: "none", border: "none" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  card: { background: WHITE, borderRadius: 14, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
  cardImg: { width: "100%", height: 120, objectFit: "cover", background: "#EEE", display: "block", position: "relative" },
  noPhoto: { height: 120, background: "#F0F0F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#AAA", fontSize: 12, gap: 6 },
  cardBody: { padding: "10px 10px 12px" },
  cardName: { fontWeight: 700, fontSize: 14, color: "#1A1A1A", marginBottom: 2 },
  cardPrice: { color: RED, fontWeight: 800, fontSize: 13, marginBottom: 4 },
  cardLoc: { display: "flex", alignItems: "center", gap: 4, color: "#888", fontSize: 12, marginBottom: 10 },
  cardBtns: { display: "flex", gap: 6 },
  viewBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, border: `1.5px solid ${RED}`, borderRadius: 8, padding: "7px 0", color: RED, fontSize: 12, fontWeight: 700, cursor: "pointer", background: WHITE },
  saveBtn: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, background: RED, border: "none", borderRadius: 8, padding: "7px 0", color: WHITE, fontSize: 12, fontWeight: 700, cursor: "pointer" },
  badge: (type) => ({ position: "absolute", top: 8, left: 8, background: type === "FEATURED" ? "#F9A825" : "#2E7D32", color: WHITE, fontSize: 10, fontWeight: 800, borderRadius: 6, padding: "3px 8px", letterSpacing: 0.5, zIndex: 2 }),
  heartBtn: { position: "absolute", top: 6, right: 6, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 20, padding: "5px 6px", cursor: "pointer", display: "flex", zIndex: 2 },
  bottomNav: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: WHITE, borderTop: "1px solid #EEE", display: "flex", zIndex: 200 },
  navItem: (active) => ({ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 0 8px", cursor: "pointer", color: active ? RED : "#999", background: "none", border: "none", fontSize: 10, fontWeight: active ? 700 : 400 }),
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 500, display: "flex", alignItems: "flex-end" },
  modal: { background: WHITE, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 480, margin: "0 auto", padding: 24, maxHeight: "90vh", overflowY: "auto" },
  modalTitle: { fontWeight: 800, fontSize: 20, color: "#1A1A1A", marginBottom: 16 },
  input: { width: "100%", padding: "12px 14px", border: "1.5px solid #DDD", borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: "border-box", outline: "none" },
  select: { width: "100%", padding: "12px 14px", border: "1.5px solid #DDD", borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: "border-box", background: WHITE },
  textarea: { width: "100%", padding: "12px 14px", border: "1.5px solid #DDD", borderRadius: 10, fontSize: 14, marginBottom: 12, boxSizing: "border-box", resize: "vertical", minHeight: 80, outline: "none" },
  primaryBtn: { width: "100%", background: RED, color: WHITE, border: "none", borderRadius: 12, padding: "14px 0", fontSize: 16, fontWeight: 800, cursor: "pointer", marginBottom: 10 },
  ghostBtn: { width: "100%", background: "transparent", color: RED, border: `2px solid ${RED}`, borderRadius: 12, padding: "12px 0", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  label: { fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 4, display: "block" },
  errorTxt: { color: RED, fontSize: 12, marginBottom: 8 },
  successTxt: { color: "#2E7D32", fontSize: 12, marginBottom: 8 },
  pill: (on) => ({ display: "inline-flex", alignItems: "center", gap: 4, background: on ? "#FFEBEE" : "#F5F5F5", color: on ? RED : "#666", borderRadius: 20, padding: "4px 10px", fontSize: 12, fontWeight: 600 }),
  postFab: { position: "fixed", bottom: 90, right: 16, background: RED, color: WHITE, border: "none", borderRadius: 50, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(183,28,28,0.5)", zIndex: 300 },
};

// ── TERMS & CONDITIONS ─────────────────────────────────────────────────────────
const TermsModal = ({ onAccept, onDecline }) => (
  <div style={S.modalOverlay}>
    <div style={{ ...S.modal, maxHeight: "85vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 17 }}>Terms & Conditions</h2>
        <button onClick={onDecline} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="close" size={22} color="#555" /></button>
      </div>
      <div style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 16 }}>
        <p style={{ fontWeight: 700, color: RED, marginBottom: 8 }}>Welcome to CAR-FLIX Uganda</p>
        <p>CAR-FLIX is a third-party marketplace platform that helps connect car sellers with interested buyers from different parts of Africa.</p>
        <p>The role of CAR-FLIX is <strong>only to help link buyers and sellers</strong> and increase the visibility of listings to potential buyers.</p>
        <p>CAR-FLIX team members are <strong>not responsible</strong> for agreements made between buyers and sellers, including negotiations, payments, or transaction outcomes.</p>
        <p>If there are any illegalities concerning a listed vehicle — such as theft, fraud, or tax violations — the CAR-FLIX team is <strong>not liable</strong>. Such matters will be handled by the appropriate law enforcement authorities.</p>
        <p style={{ fontWeight: 600 }}>By registering, you confirm that you have read, understood, and agreed to these Terms & Conditions.</p>
      </div>
      <button onClick={onAccept} style={S.primaryBtn}>I Accept & Continue</button>
      <button onClick={onDecline} style={S.ghostBtn}>Decline</button>
    </div>
  </div>
);

// ── WHATSAPP PICKER MODAL ──────────────────────────────────────────────────────
const WaPickerModal = ({ carName, price, onClose }) => {
  const msg = carName
    ? `Hi, I am interested in the *${carName}* listed at *${formatPrice(price)}* on CAR-FLIX Uganda. Please share more details.`
    : `Hi, I would like to enquire about a car listing on CAR-FLIX Uganda.`;
  return (
    <div style={S.modalOverlay}>
      <div style={S.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 18 }}>Contact via WhatsApp</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="close" size={22} color="#555" /></button>
        </div>
        <p style={{ color: "#777", fontSize: 13, marginBottom: 18 }}>Choose which line to message. All lines go to our CAR-FLIX team.</p>
        {WA_NUMBERS.map((wa, i) => (
          <button
            key={i}
            onClick={() => { window.open(`https://wa.me/${wa.number}?text=${encodeURIComponent(msg)}`, "_blank"); onClose(); }}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, background: i === 0 ? "#E8F5E9" : i === 1 ? "#E3F2FD" : "#FFF8E1", border: "none", borderRadius: 12, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 21, background: i === 0 ? "#2E7D32" : i === 1 ? "#1565C0" : "#E65100", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="whatsapp" size={22} color={WHITE} />
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: "#1A1A1A" }}>{wa.label}</p>
              <p style={{ fontSize: 13, color: "#555", margin: 0 }}>{wa.display}</p>
            </div>
            <div style={{ marginLeft: "auto", color: "#AAA" }}>›</div>
          </button>
        ))}
        <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// ── AUTH MODAL ─────────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  // 🔥 Auto-fill last email
  useEffect(() => {
    const savedEmail = localStorage.getItem("lastEmail");
    if (savedEmail) {
      setForm((f) => ({ ...f, email: savedEmail }));
    }
  }, []);

  // REGISTER
  const handleRegister = async () => {
    setErr("");
    setLoading(true);

    if (!form.username || !form.email || !form.phone || !form.password) {
      setLoading(false);
      return setErr("All fields are required.");
    }

    if (form.password !== form.confirmPassword) {
      setLoading(false);
      return setErr("Passwords do not match");
    }

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      return setErr(error.message);
    }

    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user?.id,
        username: form.username,
        phone: form.phone,
        is_admin: false,
      },
    ]);

    if (insertError) {
      setLoading(false);
      return setErr(insertError.message);
    }

    localStorage.setItem("lastEmail", form.email);

    setLoading(false);
    alert("Account created! Now login.");
    setMode("login");
  };

  // LOGIN
  const handleLogin = async () => {
    setErr("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setLoading(false);
      return setErr(error.message);
    }

    localStorage.setItem("lastEmail", form.email);

    onLogin(form.email, form.password);
    setLoading(false);
  };

  return (
    <div style={S.modalOverlay}>
      <div style={S.modal}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
          <button onClick={onClose}>X</button>
        </div>

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <label style={S.label}>Username</label>
            <input style={S.input} value={form.username} onChange={set("username")} />

            <label style={S.label}>Email</label>
            <input style={S.input} value={form.email} onChange={set("email")} />

            <label style={S.label}>Phone Number</label>
            <input style={S.input} value={form.phone} onChange={set("phone")} />
          </>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <label style={S.label}>Email</label>
            <input style={S.input} value={form.email} onChange={set("email")} />
          </>
        )}

        {/* PASSWORD */}
        <label style={S.label}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            style={S.input}
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={set("password")}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: 12,
              color: "#777",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* CONFIRM PASSWORD */}
        {mode === "register" && (
          <>
            <label style={S.label}>Confirm Password</label>
            <input
              style={S.input}
              type="password"
              value={form.confirmPassword}
              onChange={set("confirmPassword")}
            />
          </>
        )}

        {/* ERROR */}
        {err && <p style={{ color: "red" }}>{err}</p>}

        {/* BUTTON */}
        <button
          style={{
            ...S.primaryBtn,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          disabled={loading || !form.email || !form.password}
          onClick={mode === "login" ? handleLogin : handleRegister}
        >
          {loading
            ? mode === "login"
              ? "Signing in..."
              : "Creating account..."
            : mode === "login"
            ? "Sign In"
            : "Register"}
        </button>

        {/* SWITCH MODE */}
        <p>
          {mode === "login" ? "No account?" : "Already have one?"}
          <span
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setErr("");
            }}
          >
            {mode === "login" ? " Register" : " Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};
// ── CAR DETAIL PAGE ────────────────────────────────────────────────────────────
const CarDetail = ({ car, user, onBack, savedIds, onToggleSave }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [showWaPicker, setShowWaPicker] = useState(false);
  const saved = savedIds.includes(car.id);
  const imgs = car.images && car.images.length > 0 ? car.images : null;
  return (
    <div style={{ background: "#F5F5F5", minHeight: "100vh" }}>
      <div style={{ ...S.header, position: "sticky", top: 0 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: WHITE, display: "flex" }}><Icon name="back" size={24} color={WHITE} /></button>
        <span style={{ ...S.logoText, fontSize: 17 }}>Car Details</span>
        <button onClick={() => onToggleSave(car.id)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <Icon name={saved ? "heart" : "heart-outline"} size={24} color={WHITE} />
        </button>
      </div>
      <div style={{ position: "relative", background: "#EEE" }}>
        {imgs ? (
          <img src={imgs[imgIdx]} alt={car.carName} style={{ width: "100%", height: 240, objectFit: "cover" }} />
        ) : (
          <div style={{ height: 240, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#AAA", gap: 8 }}>
            <Icon name="photo" size={48} color="#CCC" /><span style={{ fontSize: 14 }}>No photos available</span>
          </div>
        )}
        {imgs && imgs.length > 1 && (
          <div style={{ position: "absolute", bottom: 12, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={() => setImgIdx(i)} style={{ width: i === imgIdx ? 20 : 8, height: 8, borderRadius: 4, background: i === imgIdx ? WHITE : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
        )}
      </div>
      {imgs && imgs.length > 1 && (
        <div style={{ display: "flex", gap: 8, padding: "10px 16px", overflowX: "auto" }}>
          {imgs.map((img, i) => (
            <img key={i} src={img} alt="" onClick={() => setImgIdx(i)} style={{ width: 64, height: 52, objectFit: "cover", borderRadius: 8, cursor: "pointer", border: i === imgIdx ? `2px solid ${RED}` : "2px solid transparent", flexShrink: 0 }} />
          ))}
        </div>
      )}
      <div style={{ background: WHITE, margin: "12px 16px", borderRadius: 14, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1A1A1A", flex: 1 }}>{car.carName}</h2>
          <span style={S.pill(true)}>{car.condition}</span>
        </div>
        <p style={{ color: RED, fontWeight: 800, fontSize: 22, margin: "4px 0 10px" }}>{formatPrice(car.price)}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#666", fontSize: 14, marginBottom: 12 }}>
          <Icon name="location" size={16} color="#999" />{car.location}
        </div>
        <div style={{ borderTop: "1px solid #F0F0F0", paddingTop: 12 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: "#333", marginBottom: 6 }}>Description</p>
          <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, margin: 0 }}>{car.description}</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {[["Brand", car.brand], ["Condition", car.condition], ["Location", car.location]].map(([k, v]) => (
            <div key={k} style={{ background: "#F9F9F9", borderRadius: 10, padding: "10px 12px" }}>
              <p style={{ color: "#999", fontSize: 11, fontWeight: 600, margin: "0 0 2px", textTransform: "uppercase" }}>{k}</p>
              <p style={{ color: "#1A1A1A", fontSize: 14, fontWeight: 700, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "0 16px 24px" }}>
        <button onClick={() => setShowWaPicker(true)} style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name="whatsapp" size={20} color={WHITE} /> Contact on WhatsApp
        </button>
        <button onClick={() => onToggleSave(car.id)} style={{ ...S.ghostBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Icon name={saved ? "heart" : "heart-outline"} size={18} color={RED} /> {saved ? "Saved" : "Save Car"}
        </button>
      </div>
    </div>
  );
};

// ── POST CAR MODAL ─────────────────────────────────────────────────────────────
const PostCarModal = ({ user, onClose, onSave, carToEdit }) => {
  const [form, setForm] = useState(carToEdit || { carName: "", brand: "Toyota", price: "", location: "", condition: "Used", description: "", images: [] });
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const handleImgUrl = (e) => {
    const url = e.target.value.trim();
    if (url && form.images.length < 7) setForm((f) => ({ ...f, images: [...f.images, url] }));
    e.target.value = "";
  };
  const removeImg = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
 const save = async () => {
  setErr("");

  if (!form.carName || !form.price || !form.location || !form.description) {
    return setErr("Please fill all required fields.");
  }

  // EDIT CAR
  if (carToEdit) {
    const { error } = await supabase
      .from("cars")
      .update({
        carName: form.carName,
        brand: form.brand,
        price: Number(form.price),
        location: form.location,
        condition: form.condition,
        description: form.description,
        images: form.images,
      })
      .eq("id", carToEdit.id);

    if (error) return setErr(error.message);
  }

  // NEW CAR
  else {
    const { error } = await supabase.from("cars").insert([
      {
        carName: form.carName,
        brand: form.brand,
        price: Number(form.price),
        location: form.location,
        condition: form.condition,
        description: form.description,
        images: form.images,
        owner_id: user.id,
        featured: false,
      },
    ]);

    if (error) return setErr(error.message);
  }

  onSave();
};
    
  return (
    <div style={S.modalOverlay}>
      <div style={{ ...S.modal, maxHeight: "90vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 18 }}>{carToEdit ? "Edit Listing" : "Post a Car"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="close" size={22} color="#555" /></button>
        </div>
        <label style={S.label}>Car Name *</label>
        <input style={S.input} placeholder="e.g. Toyota Noah 2018" value={form.carName} onChange={set("carName")} />
        <label style={S.label}>Brand *</label>
        <select style={S.select} value={form.brand} onChange={set("brand")}>
          {BRANDS.filter(b => b !== "All").map(b => <option key={b}>{b}</option>)}
        </select>
        <label style={S.label}>Price (UGX) *</label>
        <input style={S.input} type="number" placeholder="e.g. 45000000" value={form.price} onChange={set("price")} />
        <label style={S.label}>Location *</label>
        <input style={S.input} placeholder="e.g. Kampala, Nakawa" value={form.location} onChange={set("location")} />
        <label style={S.label}>Condition</label>
        <select style={S.select} value={form.condition} onChange={set("condition")}>
          {["New", "Used", "Foreign Used", "Local Used"].map(c => <option key={c}>{c}</option>)}
        </select>
        <label style={S.label}>Description *</label>
        <textarea style={S.textarea} placeholder="Describe the car..." value={form.description} onChange={set("description")} />
        <label style={S.label}>Images (paste URL, max 7)</label>
        <input style={S.input} placeholder="Paste image URL and press Enter" onKeyDown={(e) => { if (e.key === "Enter") handleImgUrl(e); }} />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
          {form.images.map((img, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={img} alt="" style={{ width: 60, height: 50, objectFit: "cover", borderRadius: 8 }} />
              <button onClick={() => removeImg(i)} style={{ position: "absolute", top: -4, right: -4, background: RED, border: "none", borderRadius: 10, width: 16, height: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="close" size={10} color={WHITE} /></button>
            </div>
          ))}
        </div>
        {err && <p style={S.errorTxt}>{err}</p>}
        <button style={S.primaryBtn} onClick={save}>{carToEdit ? "Update Listing" : "Post Car"}</button>
        <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};



// ── FILTER PANEL ───────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, onChange, onClose }) => {
  const [f, setF] = useState(filters);
  const set = (k) => (e) => setF(p => ({ ...p, [k]: e.target.value }));
  return (
    <div style={S.modalOverlay}>
      <div style={S.modal}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 18 }}>Filter Cars</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><Icon name="close" size={22} color="#555" /></button>
        </div>
        <label style={S.label}>Brand</label>
        <select style={S.select} value={f.brand} onChange={set("brand")}>
          {BRANDS.map(b => <option key={b}>{b}</option>)}
        </select>
        <label style={S.label}>Condition</label>
        <select style={S.select} value={f.condition} onChange={set("condition")}>
          {CONDITIONS.map(c => <option key={c}>{c}</option>)}
        </select>
        <label style={S.label}>Location</label>
        <input style={S.input} placeholder="e.g. Kampala" value={f.location} onChange={set("location")} />
        <label style={S.label}>Min Price (UGX)</label>
        <input style={S.input} type="number" placeholder="0" value={f.minPrice} onChange={set("minPrice")} />
        <label style={S.label}>Max Price (UGX)</label>
        <input style={S.input} type="number" placeholder="No limit" value={f.maxPrice} onChange={set("maxPrice")} />
        <button style={S.primaryBtn} onClick={() => { onChange(f); onClose(); }}>Apply Filters</button>
        <button style={S.ghostBtn} onClick={() => { const reset = { brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" }; onChange(reset); onClose(); }}>Reset</button>
      </div>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function CarFlixApp() {
  window.onerror = function (msg, url, line, col, error) {
  alert("ERROR: " + msg);
};
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUser, setPendingUser] = useState(null)
  const [user, setUser] = useState(null);
  console.log("CURRENT USER:", user);
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState("home");
  const [cars, setCars] = useState([]);
 const deleteCar = async (id) => {
  await supabase.from("cars").delete().eq("id", id);

  setCars((prev) => prev.filter((c) => c.id !== id));
};
  
  const [savedIds, setSavedIds] = useState([]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [filters, setFilters] = useState({ brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editCar, setEditCar] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showWaPicker, setShowWaPicker] = useState(false);
  const [waCarContext, setWaCarContext] = useState(null);
  useEffect(() => {
  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data?.user) {
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

        console.log("FETCHED PROFILE", profile);

      setUser(profile);
    }
  };

  getUser();
}, []);
useEffect(() => {
  const fetchCars = async () => {
    const { data } = await supabase.from("cars").select("*");
    setCars(data || []);
  };

  fetchCars();
}, []);

  const openWa = (car = null) => { setWaCarContext(car); setShowWaPicker(true); };

const refresh = async () => {
  const { data } = await supabase.from("cars").select("*");
  setCars(data || []);
};
  const toggleSave = (id) => {
    if (!user) return setShowAuth(true);
    const s = savedIds.includes(id) ? savedIds.filter(x => x !== id) : [...savedIds, id];
    setSavedIds(s);
    localStorage.setItem("saved_" + user.id, JSON.stringify(s));
  };

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
  });

  if (error) return alert(error.message);

  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single();

  setUser(profile);

  setShowAuth(false); // ✅ closes modal
};
const logout = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setSavedIds([]);
  setTab("home");
};
const acceptTerms = () => {
  setShowTerms(false);
};

  

  const filtered = cars.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.carName.toLowerCase().includes(q) && !c.brand.toLowerCase().includes(q) && !c.location.toLowerCase().includes(q) && !String(c.price).includes(q)) return false;
    const b = brandFilter !== "All" ? brandFilter : filters.brand !== "All" ? filters.brand : null;
    if (b && c.brand !== b) return false;
    if (filters.condition !== "Any Condition" && c.condition !== filters.condition) return false;
    if (filters.location && !c.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minPrice && c.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && c.price > Number(filters.maxPrice)) return false;
    return true;
  });

  const savedCars = cars.filter(c => savedIds.includes(c.id));
  const myCars = user ? cars.filter(c => c.owner_id === user.id) : [];
  if (selectedCar) return <CarDetail car={selectedCar} user={user} onBack={() => setSelectedCar(null)} savedIds={savedIds} onToggleSave={toggleSave} />;

  const CarCard = ({ car }) => (
    <div style={S.card}>
      <div style={{ position: "relative" }}>
        {car.images && car.images[0] ? (
          <img src={car.images[0]} alt={car.carName} style={S.cardImg} />
        ) : (
          <div style={S.noPhoto}><Icon name="photo" size={28} color="#CCC" /><span>No photo</span></div>
        )}
        {car.featured && <span style={S.badge("FEATURED")}>FEATURED</span>}
        {car.badge && !car.featured && <span style={S.badge("NEW")}>{car.badge}</span>}
        <button onClick={() => toggleSave(car.id)} style={S.heartBtn}>
          <Icon name={savedIds.includes(car.id) ? "heart" : "heart-outline"} size={18} color={savedIds.includes(car.id) ? RED : "#999"} />
        </button>
      </div>
      <div style={S.cardBody}>
        <p style={S.cardName}>{car.carName}</p>
        <p style={S.cardPrice}>{formatPrice(car.price)}</p>
        <div style={S.cardLoc}><Icon name="location" size={13} color="#AAA" />{car.location}</div>
        <div style={S.cardBtns}>
          <button style={S.viewBtn} onClick={() => setSelectedCar(car)}><Icon name="eye" size={14} color={RED} />View</button>
          <button style={S.saveBtn} onClick={() => toggleSave(car.id)}><Icon name={savedIds.includes(car.id) ? "heart" : "heart-outline"} size={14} color={WHITE} />Save</button>
        </div>
      </div>
    </div>
  );

return (
  <BrowserRouter>
    <Routes>

      {/* MAIN APP */}
      <Route
        path="/"
        element={
          <div>
             <div style={S.app}>
                            {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={login} setShowTerms={setShowTerms} setPendingUser={setPendingUser} />}
                            {showTerms && <TermsModal onAccept={acceptTerms} onDecline={() => setShowTerms(false)} />}  
                            {showFilter && <FilterPanel filters={filters} onChange={f => { setFilters(f); if (f.brand !== "All") setBrandFilter(f.brand); }} onClose={() => setShowFilter(false)} />}
                            {(showPost || editCar) && user && <PostCarModal user={user} carToEdit={editCar} onClose={() => { setShowPost(false); setEditCar(null); }} onSave={() => { refresh(); setShowPost(false); setEditCar(null); }} />}
                            {showWaPicker && <WaPickerModal carName={waCarContext?.carName} price={waCarContext?.price} onClose={() => setShowWaPicker(false)} />}
                            {/* HEADER */}
                            <div style={S.header}>
                              <div style={S.logo}>
                                <div style={S.logoBox}><Icon name="admin" size={22} color={RED} /></div>
                                <div><div style={S.logoText}>CAR-FLIX</div><div style={S.logoSub}>UGANDA</div></div>
                              </div>
                              <div style={S.headerIcons}>
                                <button style={S.iconBtn} onClick={() => setShowFilter(true)}><Icon name="filter" size={20} color={WHITE} /></button>
                                <button style={S.iconBtn} onClick={() => user ? logout() : setShowAuth(true)}>
                                  <Icon name={user ? "logout" : "user"} size={20} color={WHITE} />
                                </button>
                              </div>
                            </div>

                            {/* HOME TAB */}
                            {tab === "home" && (
                              <>
                                {/* SEARCH */}
                                <div style={S.searchBar}>
                                  <div style={S.searchRow}>
                                    <div style={{ position: "relative", flex: 1, minWidith: 0 }}>
                                      <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}><Icon name="search" size={18} color="#AAA" /></div>
                                      <input style={S.searchInput} placeholder="Search cars, price, or location..." value={search} onChange={e => setSearch(e.target.value)} />
                                    </div>
                                    <button style={S.searchBtn} onClick={() => {}}>Search</button>
                                  </div>
                                  <div style={S.filterRow}>
                                    {BRANDS.map(b => (
                                      <button key={b} style={S.filterChip(brandFilter === b)} onClick={() => { setBrandFilter(b); setFilters(f => ({ ...f, brand: b })); }}>
                                        {b}
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                {/* LISTINGS */}
                                <div style={S.section}>
                                  <div style={S.sectionRow}>
                                    <span style={S.sectionTitle}>{filtered.length} Car{filtered.length !== 1 ? "s" : ""} Available</span>
                                    <button style={S.browseAll} onClick={() => { setSearch(""); setBrandFilter("All"); setFilters({ brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" }); }}>Browse all listings</button>
                                  </div>
                                  {filtered.length === 0 ? (
                                    <div style={{ textAlign: "center", padding: "40px 0", color: "#AAA" }}>
                                      <Icon name="search" size={40} color="#DDD" />
                                      <p style={{ marginTop: 12 }}>No cars found. Try a different search.</p>
                                    </div>
                                  ) : (
                                    <div style={S.grid}>
                                      {filtered.map(car => <CarCard key={car.id} car={car} />)}
                                    </div>
                                  )}
                                </div>

                                {/* POST FAB */}
                                {user && (
                                  <button style={S.postFab} onClick={() => setShowPost(true)} title="Post a car">
                                    <Icon name="plus" size={26} color={WHITE} />
                                  </button>
                                )}
                                {!user && (
                                  <button style={{ ...S.postFab, background: "#888" }} onClick={() => setShowAuth(true)} title="Sign in to post">
                                    <Icon name="plus" size={26} color={WHITE} />
                                  </button>
                                )}
                              </>
                            )}

                            {/* SAVED TAB */}
                            {tab === "saved" && (
                              <div style={S.section}>
                                <div style={{ ...S.sectionRow, paddingTop: 4 }}>
                                  <span style={S.sectionTitle}>Saved Cars</span>
                                </div>
                                {!user ? (
                                  <div style={{ textAlign: "center", padding: "40px 16px" }}>
                                    <Icon name="heart" size={48} color="#EEE" />
                                    <p style={{ color: "#AAA", marginTop: 12 }}>Sign in to see your saved cars</p>
                                    <button style={{ ...S.primaryBtn, width: "auto", padding: "12px 32px", margin: "12px auto 0", display: "block" }} onClick={() => setShowAuth(true)}>Sign In</button>
                                  </div>
                                ) : savedCars.length === 0 ? (
                                  <div style={{ textAlign: "center", padding: "40px 0", color: "#AAA" }}>
                                    <Icon name="heart-outline" size={48} color="#DDD" />
                                    <p style={{ marginTop: 12 }}>No saved cars yet.<br />Tap the heart icon to save.</p>
                                  </div>
                                ) : (
                                  <div style={S.grid}>{savedCars.map(car => <CarCard key={car.id} car={car} />)}</div>
                                )}
                              </div>
                            )}

                            {/* ADMIN TAB */}
                            {tab === "admin" && (
                              <div style={S.section}>
                                <div style={{ ...S.sectionRow, paddingTop: 4 }}>
                                  <span style={S.sectionTitle}>My Listings</span>
                                </div>
                                {!user ? (
                                  <div style={{ textAlign: "center", padding: "40px 16px" }}>
                                    <Icon name="lock" size={48} color="#EEE" />
                                  <span style={{ color: "#AAA", marginTop: 12 }}>Sign in to manage your listings</span>
                                    <button style={{ ...S.primaryBtn, width: "auto", padding: "12px 32px", margin: "12px auto 0", display: "block" }} onClick={() => setShowAuth(true)}>Sign In</button>
                                  </div>
                                ) : (
                                  <>
                                    <button style={{ ...S.primaryBtn, background: RED, marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={() => setShowPost(true)}>
                                      <Icon name="plus" size={18} color={WHITE} /> Post New Car
                                    </button>
                                    {myCars.length === 0 ? (
                                      <div style={{ textAlign: "center", padding: "20px 0", color: "#AAA" }}>
                                        <p>You have no active listings.</p>
                                      </div>
                                    ) : myCars.map(car => (
                                      <div key={car.id} style={{ background: WHITE, borderRadius: 12, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center" }}>
                                        {car.images && car.images[0] ? <img src={car.images[0]} alt="" style={{ width: 64, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} /> : <div style={{ width: 64, height: 52, borderRadius: 8, background: "#F0F0F0", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name="photo" size={24} color="#CCC" /></div>}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: "#1A1A1A" }}>{car.carName}</p>
                                          <p style={{ color: RED, fontWeight: 700, fontSize: 13, margin: "0 0 2px" }}>{formatPrice(car.price)}</p>
                                          <p style={{ color: "#888", fontSize: 12, margin: 0 }}>{car.location}</p>
                                        </div>
                                        <div style={{ display: "flex", gap: 6 }}>
                                          <button onClick={() => setEditCar(car)} style={{ background: "#E3F2FD", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}><Icon name="edit" size={16} color="#1565C0" /></button>
                                          <button onClick={() => deleteCar(car.id)}  style={{ background: "#FFEBEE", border: "none", borderRadius: 8, padding: 8, cursor: "pointer" }}><Icon name="delete" size={16} color={RED} /></button>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                            )}

                            {/* ABOUT TAB */}
                            {tab === "about" && (
                              <div style={{ padding: 16 }}>
                                <div style={{ background: RED, borderRadius: 16, padding: 24, marginBottom: 16, textAlign: "center" }}>
                                  <div style={{ ...S.logoBox, width: 56, height: 56, margin: "0 auto 12px", borderRadius: 14 }}><Icon name="admin" size={32} color={RED} /></div>
                                  <h2 style={{ color: WHITE, fontWeight: 900, fontSize: 26, margin: "0 0 4px", letterSpacing: 2 }}>CAR-FLIX</h2>
                                  <p style={{ color: "rgba(255,255,255,0.7)", margin: 0, fontSize: 13, letterSpacing: 3 }}>UGANDA</p>
                                </div>
                                <div style={{ background: WHITE, borderRadius: 14, padding: 18, marginBottom: 12 }}>
                                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1A1A1A", marginTop: 0 }}>About CAR-FLIX</h3>
                                  <p style={{ color: "#555", fontSize: 14, lineHeight: 1.7, margin: 0 }}>CAR-FLIX is a third-party marketplace connecting car sellers with buyers across Africa. We are not responsible for negotiations, payments, or transaction outcomes between buyers and sellers.</p>
                                </div>
                                <div style={{ background: WHITE, borderRadius: 14, padding: 18, marginBottom: 12 }}>
                                  <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1A1A1A", marginTop: 0 }}>Contact Us</h3>
                                  <p style={{ color: "#777", fontSize: 13, marginBottom: 14 }}>Reach our team on any of these WhatsApp lines:</p>
                                  {WA_NUMBERS.map((wa, i) => (
                                    <button key={i} onClick={() => window.open(`https://wa.me/${wa.number}`, "_blank")}
                                      style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, background: i === 0 ? "#2E7D32" : i === 1 ? "#1565C0" : "#E65100" }}>
                                      <Icon name="whatsapp" size={18} color={WHITE} /> {wa.label}: {wa.display}
                                    </button>
                                  ))}
                                </div>
                                {user && (
                                  <div style={{ background: WHITE, borderRadius: 14, padding: 18 }}>
                                    <h3 style={{ fontWeight: 800, fontSize: 16, color: "#1A1A1A", marginTop: 0 }}>Account</h3>
                                    <p style={{ color: "#555", fontSize: 14, marginBottom: 4 }}>Signed in as <strong>{user.username}</strong></p>
                                    <p style={{ color: "#888", fontSize: 13, marginBottom: 14 }}>{user.phone}</p>
                                    <button style={{ ...S.ghostBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={logout}>
                                      <Icon name="logout" size={18} color={RED} /> Sign Out
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* BOTTOM NAV */}
                            <div style={S.bottomNav}>
                              {[
                                { id: "home", icon: "home", label: "Home" },
                                { id: "saved", icon: "heart", label: "Saved" },
                                { id: "admin", icon: "lock", label: "My Cars" },
                                { id: "about", icon: "info", label: "About" },
                              ].map(n => (
                                <button key={n.id} style={S.navItem(tab === n.id)} onClick={() => setTab(n.id)}>
                                  <Icon name={tab === n.id && n.id === "saved" ? "heart" : n.icon} size={22} color={tab === n.id ? RED : "#999"} />
                                  {n.label}
                                </button>
                              ))}
                            </div>
                              </div>
          </div>
        }
      />

      {/* ADMIN DASHBOARD */}
      <Route
        path="/admin"
        element={
          <AdminDashboard user={user} cars={cars} deleteCar={deleteCar} />
        }
      />

    </Routes>
  </BrowserRouter>
); 
}