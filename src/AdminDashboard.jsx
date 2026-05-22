import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
const RED      = "#B71C1C";
const RED_DARK = "#7F0000";
const WHITE    = "#FFFFFF";
const GOLD     = "#F59E0B";
const SURFACE  = "#F4F4F6";
const TEXT     = "#111827";
const MUTED    = "#6B7280";
const BORDER   = "#E5E7EB";
const GREEN    = "#16A34A";
const GREEN_BG = "#F0FDF4";
const RED_BG   = "#FFF0F0";
const AMBER    = "#D97706";
const AMBER_BG = "#FFFBEB";
const BLUE     = "#1D4ED8";
const BLUE_BG  = "#EFF6FF";
const FONT     = "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif";

// ── ICONS ─────────────────────────────────────────────────────────────────────
const PATHS = {
  car:      "M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-5h14v5z",
  users:    "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z",
  inquiry:  "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z",
  star:     "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
  search:   "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z",
  close:    "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z",
  check:    "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z",
  block:    "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
  trash:    "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  shield:   "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z",
  photo:    "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
  lock:     "M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z",
  chart:    "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z",
  location: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  edit:     "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
  left:     "M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z",
  right:    "M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z",
  sort:     "M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z",
  filter:   "M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z",
  activity: "M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.81 6-4.72 7.28L13 17v5l5-3-2.25-1.31C18.17 16.07 20 13.21 20 12c0-4.08-3.05-7.44-7-7.95zM11 2.05C7.05 2.54 4 5.9 4 9.98c0 1.21 1.83 4.07 4.25 5.69L6 17l5 3v-5l-2.28 1.28C6.81 15 5 12.21 5 9.98c0-4.08 3.05-7.44 7-7.93V2.05z",
  pending:  "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z",
  user:     "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
  ban:      "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.68L5.68 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.68L18.32 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z",
  pie:      "M11 2v20c-5.07-.5-9-4.79-9-10s3.93-9.5 9-10zm2.03 0v8.99H22c-.47-4.74-4.24-8.52-8.97-8.99zm0 11.01V22c4.74-.47 8.5-4.25 8.97-8.99h-8.97z",
};

const Icon = ({ name, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
    <path d={PATHS[name] || PATHS.car} />
  </svg>
);

// ── HELPERS ───────────────────────────────────────────────────────────────────
const statusStyle = (status) => {
  if (status === "approved") return { bg: GREEN_BG, color: GREEN, label: "Approved" };
  if (status === "rejected") return { bg: RED_BG,   color: RED,   label: "Rejected" };
  return                            { bg: AMBER_BG, color: AMBER, label: "Pending"  };
};

const logAction = (prev, msg) => {
  const entry = { msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
  const updated = [entry, ...prev].slice(0, 20);
  try { localStorage.setItem("cf_activity", JSON.stringify(updated)); } catch(_) {}
  return updated;
};

// ── CONFIRMATION MODAL ────────────────────────────────────────────────────────
const ConfirmModal = ({ title, message, confirmLabel = "Confirm", danger = true, onConfirm, onCancel }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 24px" }}>
    <div style={{ background: WHITE, borderRadius: 20, padding: 24, width: "100%", maxWidth: 360, fontFamily: FONT }}>
      <div style={{ width: 52, height: 52, borderRadius: 26, background: danger ? RED_BG : AMBER_BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Icon name={danger ? "trash" : "block"} size={26} color={danger ? RED : AMBER} />
      </div>
      <p style={{ fontWeight: 900, fontSize: 17, color: TEXT, textAlign: "center", margin: "0 0 8px" }}>{title}</p>
      <p style={{ color: MUTED, fontSize: 13, textAlign: "center", lineHeight: 1.6, margin: "0 0 22px" }}>{message}</p>
      <button onClick={onConfirm} style={{ width: "100%", background: danger ? RED : AMBER, color: WHITE, border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 800, fontSize: 14, cursor: "pointer", fontFamily: FONT, marginBottom: 8 }}>
        {confirmLabel}
      </button>
      <button onClick={onCancel} style={{ width: "100%", background: SURFACE, color: MUTED, border: "none", borderRadius: 12, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT }}>
        Cancel
      </button>
    </div>
  </div>
);

// ── IMAGE GALLERY MODAL ───────────────────────────────────────────────────────
const GalleryModal = ({ images, startIdx = 0, onClose }) => {
  const [idx, setIdx] = useState(startIdx);
  const touchStartX = useRef(null);

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40) next();
    else if (dx > 40) prev();
    touchStartX.current = null;
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: FONT }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* Close */}
      <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: 10, cursor: "pointer", display: "flex" }}>
        <Icon name="close" size={22} color={WHITE} />
      </button>

      {/* Counter */}
      <p style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 700 }}>
        {idx + 1} / {images.length}
      </p>

      {/* Image */}
      <img src={images[idx]} alt="" style={{ maxWidth: "92%", maxHeight: "72vh", borderRadius: 16, objectFit: "contain", display: "block" }} />

      {/* Dot strip */}
      <div style={{ display: "flex", gap: 6, marginTop: 20 }}>
        {images.map((_, i) => (
          <div key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 20 : 7, height: 7, borderRadius: 4, background: i === idx ? WHITE : "rgba(255,255,255,0.3)", cursor: "pointer", transition: "all 0.2s" }} />
        ))}
      </div>

      {/* Arrows (shown if > 1 image) */}
      {images.length > 1 && (
        <>
          <button onClick={prev} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "10px 8px", cursor: "pointer", display: "flex" }}>
            <Icon name="left" size={24} color={WHITE} />
          </button>
          <button onClick={next} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 20, padding: "10px 8px", cursor: "pointer", display: "flex" }}>
            <Icon name="right" size={24} color={WHITE} />
          </button>
        </>
      )}
    </div>
  );
};

// ── EDIT CAR MODAL ────────────────────────────────────────────────────────────
const EditCarModal = ({ car, onSave, onClose }) => {
  const [form, setForm] = useState({ carName: car.carName, brand: car.brand, price: car.price, location: car.location, condition: car.condition, description: car.description });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    if (!form.carName || !form.price || !form.location) return setErr("Name, price and location are required.");
    setSaving(true); setErr("");
    const { error } = await supabase.from("cars").update({ carName: form.carName, brand: form.brand, price: Number(form.price), location: form.location, condition: form.condition, description: form.description }).eq("id", car.id);
    setSaving(false);
    if (error) return setErr(error.message);
    onSave({ ...car, ...form, price: Number(form.price) });
    onClose();
  };

  const inputStyle = { width: "100%", padding: "12px 14px", border: `1.5px solid ${BORDER}`, borderRadius: 12, fontSize: 14, boxSizing: "border-box", outline: "none", color: TEXT, background: WHITE, fontFamily: FONT, marginBottom: 12 };
  const label = (txt) => <label style={{ fontSize: 11, fontWeight: 700, color: MUTED, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 }}>{txt}</label>;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 800, display: "flex", alignItems: "flex-end", fontFamily: FONT }}>
      <div style={{ background: WHITE, borderRadius: "22px 22px 0 0", width: "100%", maxWidth: "100%", margin: "0 auto", padding: "8px 20px 32px", maxHeight: "92vh", overflowX: "hidden" }}>
        <div style={{ width: 40, height: 4, background: BORDER, borderRadius: 2, margin: "10px auto 18px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ fontWeight: 900, fontSize: 18, color: TEXT, margin: 0 }}>Edit Listing</p>
          <button onClick={onClose} style={{ background: SURFACE, border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
            <Icon name="close" size={18} color={MUTED} />
          </button>
        </div>

        {label("Car Name")}
        <input style={inputStyle} value={form.carName} onChange={set("carName")} placeholder="e.g. Toyota Noah 2018" />

        {label("Brand")}
        <select style={{ ...inputStyle, background: WHITE }} value={form.brand} onChange={set("brand")}>
          {["Toyota","Mercedes-Benz","BMW","Nissan","Honda","Subaru","Other"].map(b => <option key={b}>{b}</option>)}
        </select>

        {label("Price (UGX)")}
        <input style={inputStyle} type="number" value={form.price} onChange={set("price")} placeholder="45000000" />

        {label("Location")}
        <input style={inputStyle} value={form.location} onChange={set("location")} placeholder="e.g. Kampala" />

        {label("Condition")}
        <select style={{ ...inputStyle, background: WHITE }} value={form.condition} onChange={set("condition")}>
          {["New","Used","Foreign Used","Local Used"].map(c => <option key={c}>{c}</option>)}
        </select>

        {label("Description")}
        <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} value={form.description} onChange={set("description")} placeholder="Describe the car…" />

        {err && <div style={{ background: RED_BG, borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}><p style={{ color: RED, fontSize: 12, fontWeight: 600, margin: 0 }}>{err}</p></div>}

        <button onClick={save} disabled={saving} style={{ width: "100%", background: RED, color: WHITE, border: "none", borderRadius: 14, padding: "14px 0", fontSize: 15, fontWeight: 800, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: FONT, marginBottom: 8 }}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
        <button onClick={onClose} style={{ width: "100%", background: SURFACE, color: MUTED, border: "none", borderRadius: 14, padding: "13px 0", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: FONT }}>Cancel</button>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function AdminDashboard({ user, cars, setCars, deleteCar }) {

  // ── ORIGINAL STATE ────────────────────────────────────────────────────────
  const [search,   setSearch]   = useState("");
  const [users,    setUsers]    = useState([]);
  const [contacts] = useState(JSON.parse(localStorage.getItem("contacts") || "{}"));

  // ── NEW STATE ─────────────────────────────────────────────────────────────
  const [activeTab,    setActiveTab]    = useState("cars");  // cars | users | analytics
  const [selectedIds,  setSelectedIds]  = useState([]);
  const [gallery,      setGallery]      = useState(null);    // { images, startIdx }
  const [editCar,      setEditCar]      = useState(null);
  const [confirmModal, setConfirmModal] = useState(null);    // { type, payload }
  const [filterStatus, setFilterStatus] = useState("all");   // all | pending | approved | rejected
  const [sortBy,       setSortBy]       = useState("newest");
  const [activityLog,  setActivityLog]  = useState(() => { try { return JSON.parse(localStorage.getItem("cf_activity") || "[]"); } catch(_) { return []; } });

  // ── ORIGINAL FETCH ────────────────────────────────────────────────────────
  useEffect(() => { fetchUsers(); }, []);
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("users").select("*");
    if (!error && data) setUsers(data);
  };

  console.log("USER:", user);

  // ── Guards ────────────────────────────────────────────────────────────────
  if (user === null) return (
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

  if (!user?.is_admin) return (
    <div style={{ minHeight: "100vh", background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT }}>
      <div style={{ textAlign: "center", padding: "0 32px" }}>
        <div style={{ width: 72, height: 72, borderRadius: 36, background: RED_BG, border: `2px solid #FECACA`, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="lock" size={34} color={RED} />
        </div>
        <p style={{ fontWeight: 900, fontSize: 20, color: TEXT, margin: "0 0 8px" }}>Access Denied</p>
        <p style={{ color: MUTED, fontSize: 14, margin: 0, lineHeight: 1.6 }}>You don't have admin privileges.</p>
      </div>
    </div>
  );

  // ── ORIGINAL FUNCTIONS (untouched) ────────────────────────────────────────
  const getUsername = (id) => { const u = users.find((x) => x.id === id); return u ? u.username : "Unknown"; };

  const toggleFeature = async (id) => {
    const car = cars.find((c) => c.id === id);
    if (!car) return;
    const updatedFeatured = !car.featured;
    const { error } = await supabase.from("cars").update({ featured: updatedFeatured }).eq("id", id);
    if (error) { console.log(error); alert("Failed to update featured status"); return; }
    setCars(cars.map((c) => c.id === id ? { ...c, featured: updatedFeatured } : c));
    setActivityLog(p => logAction(p, `${updatedFeatured ? "Featured" : "Unfeatured"} ${car.carName}`));
  };

const updateStatus = async (id, status) => {
  const car = cars.find(c => c.id === id);

  // 1. Update database
  const { error } = await supabase
    .from("cars")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.log(error);
    alert("Failed to update status");
    return;
  }

  // 2. Update frontend state
  const updated = cars.map((c) =>
    c.id === id ? { ...c, status } : c
  );

  setCars(updated);

  // 3. Activity log
  setActivityLog((p) =>
    logAction(
      p,
      `${status.charAt(0).toUpperCase() + status.slice(1)} ${
        car?.carName || "car"
      }`
    )
  );
};

  // ── NEW FUNCTIONS ─────────────────────────────────────────────────────────
  const handleEditSave = (updatedCar) => {
    setCars(cars.map(c => c.id === updatedCar.id ? updatedCar : c));
    setActivityLog(p => logAction(p, `Edited ${updatedCar.carName}`));
  };

  const handleDeleteConfirmed = async (id) => {
    const car = cars.find(c => c.id === id);
    await deleteCar(id);
    setActivityLog(p => logAction(p, `Deleted ${car?.carName || "car"}`));
    setConfirmModal(null);
  };

  const handleBulkAction = async (action) => {
    for (const id of selectedIds) {
      if (action === "approve" || action === "reject") {
        updateStatus(id, action === "approve" ? "approved" : "rejected");
      } else if (action === "delete") {
        await deleteCar(id);
      }
    }
    if (action === "delete") setActivityLog(p => logAction(p, `Deleted ${selectedIds.length} listings`));
    else setActivityLog(p => logAction(p, `Bulk ${action}d ${selectedIds.length} listings`));
    setSelectedIds([]);
    setConfirmModal(null);
  };

  const deactivateUser = async (uid) => {
    const { error } = await supabase.from("users").update({ is_active: false }).eq("id", uid);
    if (error) { alert(error.message); return; }
    setUsers(users.map(u => u.id === uid ? { ...u, is_active: false } : u));
    const u = users.find(x => x.id === uid);
    setActivityLog(p => logAction(p, `Deactivated user ${u?.username || uid}`));
    setConfirmModal(null);
  };

  const toggleSelect = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const selectAll    = () => setSelectedIds(filtered.map(c => c.id));
  const clearSelect  = () => setSelectedIds([]);

  // ── DERIVED DATA ──────────────────────────────────────────────────────────
  const totalInquiries = Object.values(contacts).reduce((a, b) => a + b, 0);
  const pendingCount   = cars.filter(c => !c.status || c.status === "pending").length;

  const topCars = [...cars].sort((a, b) => (contacts[b.id] || 0) - (contacts[a.id] || 0)).slice(0, 5);

  // Brand breakdown
  const brandMap = {};
  cars.forEach(c => { brandMap[c.brand] = (brandMap[c.brand] || 0) + 1; });
  const brands = Object.entries(brandMap).sort((a, b) => b[1] - a[1]);
  const maxBrand = brands[0]?.[1] || 1;

  // Approval rate
  const approved = cars.filter(c => c.status === "approved").length;
  const rejected = cars.filter(c => c.status === "rejected").length;
  const pending  = cars.filter(c => !c.status || c.status === "pending").length;
  const totalCars = cars.length || 1;

  // Monthly trends (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("default", { month: "short" });
    const count = cars.filter(c => {
      if (!c.created_at) return false;
      const cd = new Date(c.created_at);
      return cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth();
    }).length;
    return { label, count };
  });
  const maxMonth = Math.max(...monthlyData.map(m => m.count), 1);

  // Search + filter + sort
  const filtered = cars
    .filter(c => {
      const q = search.toLowerCase();
      const ownerName = getUsername(c.owner_id || c.ownerId).toLowerCase();
      const matchSearch = !q || c.carName.toLowerCase().includes(q) || c.location.toLowerCase().includes(q) || ownerName.includes(q);
      const matchStatus = filterStatus === "all" || (filterStatus === "pending" ? (!c.status || c.status === "pending") : c.status === filterStatus);
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "price_hi") return b.price - a.price;
      if (sortBy === "price_lo") return a.price - b.price;
      if (sortBy === "inquiries") return (contacts[b.id] || 0) - (contacts[a.id] || 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0); // newest
    });

  // ── STAT VALUES ───────────────────────────────────────────────────────────
  const STATS = [
    { icon: "car",     gradient: `linear-gradient(135deg, ${RED_DARK}, ${RED})`,   label: "Total Cars",      value: cars.length,                         alert: pendingCount > 0 },
    { icon: "users",   gradient: "linear-gradient(135deg, #1D4ED8, #3B82F6)",       label: "Registered Users",value: users.length,                        alert: false },
    { icon: "inquiry", gradient: "linear-gradient(135deg, #065F46, #10B981)",       label: "Total Inquiries", value: totalInquiries,                      alert: false },
    { icon: "star",    gradient: `linear-gradient(135deg, #92400E, ${GOLD})`,       label: "Featured Cars",   value: cars.filter(c => c.featured).length, alert: false },
  ];

  // ── PILL BUTTON HELPER ────────────────────────────────────────────────────
  const Pill = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      background: active ? RED : WHITE,
      color: active ? WHITE : MUTED,
      border: active ? "none" : `1.5px solid ${BORDER}`,
      borderRadius: 20, padding: "7px 14px", fontSize: 12, fontWeight: 700,
      cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontFamily: FONT,
      boxShadow: active ? `0 2px 8px ${RED}44` : "none",
    }}>{children}</button>
  );

  return (
    <div style={{ background: SURFACE, minHeight: "100vh", fontFamily: FONT, maxWidth: 480, margin: "0 auto", paddingBottom: 40 }}>

      {/* Modals */}
      {gallery      && <GalleryModal images={gallery.images} startIdx={gallery.startIdx} onClose={() => setGallery(null)} />}
      {editCar      && <EditCarModal car={editCar} onSave={handleEditSave} onClose={() => setEditCar(null)} />}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          danger={confirmModal.danger !== false}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`, padding: "16px 18px 0", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(127,0,0,0.3)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "8px 10px", border: "1px solid rgba(255,255,255,0.2)", display: "flex" }}>
              <Icon name="shield" size={22} color={WHITE} />
            </div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontWeight: 700, margin: 0, letterSpacing: 2, textTransform: "uppercase" }}>CAR-FLIX</p>
              <p style={{ color: WHITE, fontSize: 17, fontWeight: 900, margin: 0 }}>Admin Dashboard</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {pendingCount > 0 && (
              <div style={{ background: AMBER, borderRadius: 20, padding: "4px 10px", display: "flex", alignItems: "center", gap: 5 }}>
                <Icon name="pending" size={13} color={WHITE} />
                <span style={{ color: WHITE, fontSize: 11, fontWeight: 800 }}>{pendingCount} pending</span>
              </div>
            )}
            <div style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "5px 12px", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: "#4ADE80" }} />
              <span style={{ color: WHITE, fontSize: 11, fontWeight: 700 }}>Admin</span>
            </div>
          </div>
        </div>

        {/* ── Tab bar inside header ── */}
        <div style={{ display: "flex", gap: 4 }}>
          {[
            { id: "cars",      icon: "car",      label: "Cars"      },
            { id: "users",     icon: "users",     label: "Users"     },
            { id: "analytics", icon: "chart",     label: "Analytics" },
            { id: "activity",  icon: "activity",  label: "Activity"  },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: "transparent", border: "none", padding: "8px 0 0", cursor: "pointer",
              color: activeTab === t.id ? WHITE : "rgba(255,255,255,0.5)", fontFamily: FONT,
              fontSize: 10, fontWeight: activeTab === t.id ? 800 : 500,
              borderBottom: activeTab === t.id ? `2.5px solid ${WHITE}` : "2.5px solid transparent",
              paddingBottom: 10,
            }}>
              <Icon name={t.icon} size={18} color={activeTab === t.id ? WHITE : "rgba(255,255,255,0.5)"} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 16px 0" }}>

        {/* ── STAT CARDS (all tabs) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ background: WHITE, borderRadius: 18, padding: "16px 16px 14px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${BORDER}`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -10, right: -10, width: 60, height: 60, borderRadius: 30, background: s.gradient, opacity: 0.08 }} />
              <div style={{ width: 38, height: 38, borderRadius: 12, background: s.gradient, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
                <Icon name={s.icon} size={19} color={WHITE} />
              </div>
              <p style={{ color: MUTED, fontSize: 11, fontWeight: 600, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: 0.5 }}>{s.label}</p>
              <p style={{ color: TEXT, fontSize: 26, fontWeight: 900, margin: 0, letterSpacing: -1 }}>{s.value}</p>
              {s.alert && pendingCount > 0 && (
                <div style={{ position: "absolute", top: 10, right: 10, background: AMBER, color: WHITE, fontSize: 10, fontWeight: 800, borderRadius: 10, padding: "2px 7px" }}>{pendingCount}</div>
              )}
            </div>
          ))}
        </div>

        {/* ══════════════ CARS TAB ══════════════ */}
        {activeTab === "cars" && (
          <>
            {/* Search bar */}
            <div style={{ background: WHITE, borderRadius: 14, border: `1px solid ${BORDER}`, padding: "0 14px", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              <Icon name="search" size={17} color="#8696A0" />
              <input placeholder="Search name, location or owner…" value={search} onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, padding: "13px 0", border: "none", outline: "none", fontSize: 14, color: TEXT, background: "transparent", fontFamily: FONT }} />
              {search.length > 0 && (
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4 }}>
                  <Icon name="close" size={16} color="#8696A0" />
                </button>
              )}
            </div>

            {/* Filter + Sort row */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" }}>
              {[
                { val: "all",      label: `All (${cars.length})`      },
                { val: "pending",  label: `⏳ Pending (${pending})`   },
                { val: "approved", label: `✅ Approved (${approved})`  },
                { val: "rejected", label: `❌ Rejected (${rejected})`  },
              ].map(f => <Pill key={f.val} active={filterStatus === f.val} onClick={() => setFilterStatus(f.val)}>{f.label}</Pill>)}
              <div style={{ width: 1, background: BORDER, flexShrink: 0, margin: "0 2px" }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ background: WHITE, border: `1.5px solid ${BORDER}`, borderRadius: 20, padding: "7px 12px", fontSize: 12, fontWeight: 700, color: MUTED, fontFamily: FONT, cursor: "pointer", flexShrink: 0 }}>
                <option value="newest">Newest</option>
                <option value="price_hi">Price ↑</option>
                <option value="price_lo">Price ↓</option>
                <option value="inquiries">Most Inquiries</option>
              </select>
            </div>

            {/* Bulk action bar */}
            {selectedIds.length > 0 && (
              <div style={{ background: TEXT, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                <span style={{ color: WHITE, fontWeight: 700, fontSize: 13 }}>{selectedIds.length} selected</span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setConfirmModal({ title: `Approve ${selectedIds.length} cars?`, message: "All selected listings will be marked as approved.", confirmLabel: "Approve All", danger: false, onConfirm: () => handleBulkAction("approve") })}
                    style={{ background: GREEN, color: WHITE, border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>
                    ✔ Approve
                  </button>
                  <button onClick={() => setConfirmModal({ title: `Reject ${selectedIds.length} cars?`, message: "All selected listings will be marked as rejected.", confirmLabel: "Reject All", onConfirm: () => handleBulkAction("reject") })}
                    style={{ background: AMBER, color: WHITE, border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>
                    ✖ Reject
                  </button>
                  <button onClick={() => setConfirmModal({ title: `Delete ${selectedIds.length} cars?`, message: "This cannot be undone. All selected listings will be permanently removed.", confirmLabel: "Delete All", onConfirm: () => handleBulkAction("delete") })}
                    style={{ background: RED, color: WHITE, border: "none", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: FONT }}>
                    🗑
                  </button>
                  <button onClick={clearSelect} style={{ background: "rgba(255,255,255,0.12)", color: WHITE, border: "none", borderRadius: 10, padding: "7px 10px", fontSize: 12, cursor: "pointer", fontFamily: FONT }}>✕</button>
                </div>
              </div>
            )}

            {/* Select all row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: 0 }}>
                {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
              </p>
              <button onClick={selectedIds.length === filtered.length ? clearSelect : selectAll}
                style={{ background: "none", border: "none", color: RED, fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT }}>
                {selectedIds.length === filtered.length && filtered.length > 0 ? "Deselect all" : "Select all"}
              </button>
            </div>

            {/* ── Empty pending state ── */}
            {filterStatus === "pending" && pending === 0 && (
              <div style={{ textAlign: "center", padding: "52px 24px", background: WHITE, borderRadius: 18, border: `1px solid ${BORDER}`, marginBottom: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: GREEN_BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Icon name="check" size={30} color={GREEN} />
                </div>
                <p style={{ fontWeight: 800, fontSize: 16, color: TEXT, margin: "0 0 6px" }}>All caught up! 🎉</p>
                <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>No pending listings — everything has been reviewed.</p>
              </div>
            )}

            {/* ── Car list ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 24 }}>
              {filtered.map(car => {
                const st       = statusStyle(car.status);
                const isSelected = selectedIds.includes(car.id);
                const imgs     = car.images && car.images.length > 0 ? car.images : null;
                return (
                  <div key={car.id} style={{
                    background: WHITE, borderRadius: 18, overflow: "hidden",
                    boxShadow: isSelected ? `0 0 0 2.5px ${RED}` : "0 2px 12px rgba(0,0,0,0.07)",
                    border: isSelected ? `1.5px solid ${RED}` : `1px solid ${BORDER}`,
                    transition: "box-shadow 0.15s",
                  }}>
                    {/* Image / gallery */}
                    <div style={{ position: "relative", cursor: imgs ? "pointer" : "default" }}
                      onClick={() => imgs && setGallery({ images: imgs, startIdx: 0 })}>
                      {imgs ? (
                        <img src={imgs[0]} alt="" style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                      ) : (
                        <div style={{ height: 100, background: "#F3F4F6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                          <Icon name="photo" size={30} color="#D1D5DB" />
                          <span style={{ fontSize: 11, color: "#C4C4C4" }}>No photos</span>
                        </div>
                      )}

                      {imgs && imgs.length > 1 && (
                        <div style={{ position: "absolute", bottom: 10, right: 10, background: "rgba(0,0,0,0.55)", borderRadius: 8, padding: "3px 8px" }}>
                          <span style={{ color: WHITE, fontSize: 11, fontWeight: 700 }}>📷 {imgs.length}</span>
                        </div>
                      )}
                      {car.featured && (
                        <div style={{ position: "absolute", top: 10, left: 10, background: GOLD, color: WHITE, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8 }}>⭐ FEATURED</div>
                      )}
                      <div style={{ position: "absolute", top: 10, right: 10, background: st.bg, color: st.color, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, border: `1px solid ${st.color}33` }}>
                        {st.label}
                      </div>

                      {/* Checkbox overlay */}
                      <div onClick={e => { e.stopPropagation(); toggleSelect(car.id); }}
                        style={{ position: "absolute", top: 10, left: car.featured ? "auto" : 10, right: car.featured ? "auto" : "auto",
                          left: 10, top: imgs ? (car.featured ? 42 : 10) : 8,
                          width: 24, height: 24, borderRadius: 12,
                          background: isSelected ? RED : "rgba(255,255,255,0.9)",
                          border: isSelected ? "none" : "2px solid rgba(0,0,0,0.2)",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 5 }}>
                        {isSelected && <Icon name="check" size={13} color={WHITE} />}
                      </div>
                    </div>

                    {/* Info */}
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
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 13, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="user" size={14} color={MUTED} />
                          </div>
                          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{getUsername(car.owner_id || car.ownerId)}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <Icon name="inquiry" size={13} color={MUTED} />
                          <span style={{ fontSize: 12, color: MUTED, fontWeight: 600 }}>{contacts[car.id] || 0} inquiries</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ padding: "12px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <button onClick={() => updateStatus(car.id, "approved")}
                          style={{ background: car.status === "approved" ? GREEN : GREEN_BG, color: car.status === "approved" ? WHITE : GREEN, border: `1.5px solid ${GREEN}`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: FONT }}>
                          <Icon name="check" size={15} color={car.status === "approved" ? WHITE : GREEN} />Approve
                        </button>
                        <button onClick={() => updateStatus(car.id, "rejected")}
                          style={{ background: car.status === "rejected" ? RED : RED_BG, color: car.status === "rejected" ? WHITE : RED, border: `1.5px solid ${RED}`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: FONT }}>
                          <Icon name="block" size={15} color={car.status === "rejected" ? WHITE : RED} />Reject
                        </button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                        <button onClick={() => toggleFeature(car.id)}
                          style={{ background: car.featured ? GOLD : AMBER_BG, color: car.featured ? WHITE : AMBER, border: `1.5px solid ${GOLD}`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: FONT }}>
                          <Icon name="star" size={14} color={car.featured ? WHITE : AMBER} />{car.featured ? "Unfeature" : "Feature"}
                        </button>
                        <button onClick={() => setEditCar(car)}
                          style={{ background: BLUE_BG, color: BLUE, border: `1.5px solid #BFDBFE`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: FONT }}>
                          <Icon name="edit" size={14} color={BLUE} />Edit
                        </button>
                        <button onClick={() => setConfirmModal({ title: "Delete this car?", message: `"${car.carName}" will be permanently removed and cannot be recovered.`, confirmLabel: "Delete", onConfirm: () => handleDeleteConfirmed(car.id) })}
                          style={{ background: RED_BG, color: RED, border: `1.5px solid #FECACA`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, fontFamily: FONT }}>
                          <Icon name="trash" size={14} color={RED} />Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ══════════════ USERS TAB ══════════════ */}
        {activeTab === "users" && (
          <>
            <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: "0 0 14px" }}>
              {users.length} Registered User{users.length !== 1 ? "s" : ""}
            </p>
            {users.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", color: MUTED }}>
                <Icon name="users" size={40} color="#E5E7EB" />
                <p style={{ marginTop: 12, fontWeight: 600 }}>No users found</p>
              </div>
            ) : users.map(u => {
              const userCars = cars.filter(c => (c.owner_id || c.ownerId) === u.id);
              const isActive = u.is_active !== false;
              return (
                <div key={u.id} style={{ background: WHITE, borderRadius: 18, padding: "14px 16px", marginBottom: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: isActive ? "#EFF6FF" : "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="user" size={22} color={isActive ? BLUE : "#C4C4C4"} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontWeight: 800, fontSize: 14, color: TEXT, margin: 0 }}>{u.username}</p>
                        {u.is_admin && <span style={{ background: RED_BG, color: RED, fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6 }}>ADMIN</span>}
                        {!isActive && <span style={{ background: "#F3F4F6", color: MUTED, fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 6 }}>INACTIVE</span>}
                      </div>
                      <p style={{ color: MUTED, fontSize: 12, margin: "2px 0 0" }}>{u.phone || "No phone"}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontWeight: 800, fontSize: 18, color: TEXT, margin: 0 }}>{userCars.length}</p>
                      <p style={{ color: MUTED, fontSize: 10, margin: 0 }}>listing{userCars.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  {/* User's car chips */}
                  {userCars.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                      {userCars.slice(0, 3).map(c => (
                        <span key={c.id} style={{ background: SURFACE, color: MUTED, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: `1px solid ${BORDER}` }}>
                          {c.carName}
                        </span>
                      ))}
                      {userCars.length > 3 && (
                        <span style={{ background: SURFACE, color: MUTED, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 20, border: `1px solid ${BORDER}` }}>
                          +{userCars.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {!u.is_admin && isActive && (
                    <button
                      onClick={() => setConfirmModal({ title: `Deactivate ${u.username}?`, message: "This will mark the user as inactive. They won't be deleted but will be flagged.", confirmLabel: "Deactivate", onConfirm: () => deactivateUser(u.id) })}
                      style={{ width: "100%", background: RED_BG, color: RED, border: `1.5px solid #FECACA`, borderRadius: 12, padding: "10px 0", cursor: "pointer", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: FONT }}>
                      <Icon name="ban" size={15} color={RED} />Deactivate Account
                    </button>
                  )}
                  {!isActive && (
                    <div style={{ background: "#F3F4F6", borderRadius: 12, padding: "10px 14px", textAlign: "center" }}>
                      <p style={{ color: MUTED, fontSize: 12, fontWeight: 600, margin: 0 }}>Account is deactivated</p>
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* ══════════════ ANALYTICS TAB ══════════════ */}
        {activeTab === "analytics" && (
          <>
            {/* Approval Rate */}
            <div style={{ background: WHITE, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ background: `linear-gradient(135deg, ${RED_DARK}, ${RED})`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="pie" size={20} color={WHITE} />
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, margin: 0 }}>Approval Rate</p>
              </div>
              <div style={{ padding: "16px" }}>
                {/* Stacked bar */}
                <div style={{ height: 18, borderRadius: 9, overflow: "hidden", display: "flex", marginBottom: 14 }}>
                  {approved > 0 && <div style={{ flex: approved, background: GREEN }} />}
                  {pending  > 0 && <div style={{ flex: pending,  background: AMBER }} />}
                  {rejected > 0 && <div style={{ flex: rejected, background: RED   }} />}
                </div>
                <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
                  {[
                    { label: "Approved", count: approved, color: GREEN },
                    { label: "Pending",  count: pending,  color: AMBER },
                    { label: "Rejected", count: rejected, color: RED   },
                  ].map(item => (
                    <div key={item.label} style={{ textAlign: "center" }}>
                      <div style={{ width: 10, height: 10, borderRadius: 5, background: item.color, margin: "0 auto 4px" }} />
                      <p style={{ color: MUTED, fontSize: 11, margin: "0 0 2px" }}>{item.label}</p>
                      <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: 0 }}>{item.count}</p>
                      <p style={{ color: MUTED, fontSize: 10, margin: 0 }}>{Math.round((item.count / totalCars) * 100)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly trend */}
            <div style={{ background: WHITE, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ background: "linear-gradient(135deg, #1D4ED8, #3B82F6)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="chart" size={20} color={WHITE} />
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, margin: 0 }}>Listings Per Month</p>
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
                  {monthlyData.map((m, i) => (
                    <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: MUTED }}>{m.count}</span>
                      <div style={{ width: "100%", background: `linear-gradient(180deg, #3B82F6, #1D4ED8)`, borderRadius: "4px 4px 0 0", height: `${Math.round((m.count / maxMonth) * 72)}px`, minHeight: m.count > 0 ? 6 : 0, transition: "height 0.4s ease" }} />
                      <span style={{ fontSize: 10, color: MUTED, fontWeight: 600 }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Brand breakdown */}
            <div style={{ background: WHITE, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ background: `linear-gradient(135deg, #92400E, ${GOLD})`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="car" size={20} color={WHITE} />
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, margin: 0 }}>Brand Breakdown</p>
              </div>
              <div style={{ padding: "14px 16px" }}>
                {brands.length === 0 ? (
                  <p style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: "16px 0" }}>No data yet</p>
                ) : brands.map(([brand, count], i) => (
                  <div key={brand} style={{ marginBottom: i < brands.length - 1 ? 12 : 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: TEXT }}>{brand}</span>
                      <span style={{ fontWeight: 800, fontSize: 13, color: GOLD }}>{count} car{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.round((count / maxBrand) * 100)}%`, background: `linear-gradient(90deg, #92400E, ${GOLD})`, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top cars */}
            <div style={{ background: WHITE, borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", border: `1px solid ${BORDER}`, marginBottom: 16 }}>
              <div style={{ background: `linear-gradient(135deg, #065F46, #10B981)`, padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="inquiry" size={20} color={WHITE} />
                <p style={{ color: WHITE, fontWeight: 800, fontSize: 15, margin: 0 }}>Top Performing Cars</p>
              </div>
              <div style={{ padding: "14px 16px" }}>
                {topCars.length === 0 ? (
                  <p style={{ color: MUTED, fontSize: 13, textAlign: "center", padding: "16px 0" }}>No inquiry data yet</p>
                ) : topCars.map((car, i) => {
                  const count = contacts[car.id] || 0;
                  const max   = contacts[topCars[0]?.id] || 1;
                  const pct   = Math.round((count / max) * 100);
                  const rankColors = [RED, AMBER, BLUE, MUTED, MUTED];
                  return (
                    <div key={car.id} style={{ marginBottom: i < topCars.length - 1 ? 14 : 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 22, height: 22, borderRadius: 11, background: rankColors[i], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ color: WHITE, fontSize: 10, fontWeight: 900 }}>{i + 1}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{car.carName}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 800, color: rankColors[i], flexShrink: 0 }}>{count} inq.</span>
                      </div>
                      <div style={{ height: 5, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: rankColors[i], borderRadius: 3 }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ══════════════ ACTIVITY TAB ══════════════ */}
        {activeTab === "activity" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: 0 }}>Recent Actions</p>
              {activityLog.length > 0 && (
                <button onClick={() => { setActivityLog([]); localStorage.removeItem("cf_activity"); }}
                  style={{ background: "none", border: "none", color: MUTED, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                  Clear log
                </button>
              )}
            </div>
            {activityLog.length === 0 ? (
              <div style={{ textAlign: "center", padding: "52px 24px", background: WHITE, borderRadius: 18, border: `1px solid ${BORDER}` }}>
                <div style={{ width: 60, height: 60, borderRadius: 30, background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Icon name="activity" size={28} color="#D1D5DB" />
                </div>
                <p style={{ fontWeight: 700, fontSize: 15, color: TEXT, margin: "0 0 6px" }}>No activity yet</p>
                <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>Actions like approvals, edits and deletions will appear here.</p>
              </div>
            ) : (
              <div style={{ background: WHITE, borderRadius: 18, border: `1px solid ${BORDER}`, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                {activityLog.map((entry, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderBottom: i < activityLog.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 18, background: SURFACE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon name="shield" size={17} color={RED} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 13, color: TEXT, margin: "0 0 2px" }}>{entry.msg}</p>
                      <p style={{ color: MUTED, fontSize: 11, margin: 0 }}>Today at {entry.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
