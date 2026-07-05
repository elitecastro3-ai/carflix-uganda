import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import { supabase } from "./supabase";
import { Turnstile } from "@marsidev/react-turnstile";
import imageCompression from "browser-image-compression";
import {
  CarGridSkeleton,
  FeaturedSkeleton,
  ImportGridSkeleton,
  CarDetailSkeleton,
  TextSkeleton,
  PillSkeleton,
  ButtonSkeleton
} from "./Skeletons";
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

// Mock data for the "Imports" tab — cars en route, not yet in-country.
// TODO(backend): swap this for `await supabase.from("imports").select("*")`
// once an `imports` table exists, the same way MOCK_CARS was swapped for `cars`.
const MOCK_IMPORTS = [
  { id: "imp1", carName: "Alphard 2022", brand: "Toyota", price: 145000000, location: "In transit", originCountry: "Japan", expectedArrival: "Aug 2026", condition: "Foreign Used", description: "Toyota Alphard 2022, twin power doors, full leather. Currently on shipment from Japan.", images: ["https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=400&q=80"] },
  { id: "imp2", carName: "RX 350 2021", brand: "Lexus", price: 165000000, location: "In transit", originCountry: "UAE", expectedArrival: "Jul 2026", condition: "Foreign Used", description: "Lexus RX 350 F-Sport 2021, low mileage, full options. Awaiting customs clearance.", images: [] },
  { id: "imp3", carName: "CX-5 2022", brand: "Mazda", price: 98000000, location: "In transit", originCountry: "Japan", expectedArrival: "Sep 2026", condition: "Foreign Used", description: "Mazda CX-5 2022, AWD, sunroof. Booked on next vessel from Japan.", images: ["https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&q=80"] },
  { id: "imp4", carName: "Outback 2020", brand: "Subaru", price: 88000000, location: "In transit", originCountry: "USA", expectedArrival: "Aug 2026", condition: "Foreign Used", description: "Subaru Outback 2020, AWD, towbar fitted. In transit, dock ETA confirmed.", images: [] },
];

const BRANDS = ["All", "Toyota", "Mercedes-Benz", "BMW", "Nissan", "Honda", "Subaru", "Ford", "Mazda", "Land Rover", "Volkswagen", "Suzuki", "Mitsubishi", "Volvo", "Jeep", "Other"];
const CONDITIONS = ["Any Condition", "New", "Used", "Foreign Used", "Local Used"];
const WA_NUMBERS = [
  { label: "CAR-FLIX Line 1", number: "256708866140", display: "0708 866 140" },
  { label: "CAR-FLIX Line 2", number: "256787981089", display: "0787 981 089" },
  { label: "APP SUPPORT", number: "256708744769", display: "0708 447 769" },
];

const formatPrice = (p) => "UGX " + p.toLocaleString();

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
    car: "M20.77 10.34C20.44 9.53 19.65 9 18.78 9h-1.81L14.94 5.57C14.56 5.21 14.05 5 13.52 5H7.5C6.23 5 5.09 5.72 4.56 6.84L3.1 9.82C2.43 10.17 2 10.88 2 11.67V15c0 .55.45 1 1 1h1.05c.26 1.16 1.29 2 2.45 2 1.16 0 2.19-.84 2.45-2h5.1c.26 1.16 1.29 2 2.45 2 1.16 0 2.19-.84 2.45-2H21c.55 0 1-.45 1-1v-2.22c0-.53-.14-1.05-.4-1.5l-.83-1.44zM6.5 17c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm11 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zM5.5 10l1.25-2.5C7.06 7.2 7.26 7 7.5 7h6.02l1.96 3H5.5z",
    shipping: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17 6.5l2.25 3H17V6.5zM18 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z",
    logout: "M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z",
    user: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    image: "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z",
    star: "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z",
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
const GOLD = "#F59E0B";
const SURFACE = "#F4F4F6";
const TEXT = "#111827";
const MUTED = "#6B7280";
const BORDER = "#E5E7EB";
const CARD = "#FFFFFF";

// ── STYLES ─────────────────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    background: SURFACE,
    minHeight: "100vh",
    maxWidth: 480,
    margin: "0 auto",
    position: "relative",
    paddingBottom: 100,
  },

  // ── Header
  header: {
    background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 16px rgba(127,0,0,0.35)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoBox: {
    background: "rgba(255,255,255,0.18)",
    borderRadius: 12,
    padding: "7px 9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.25)",
  },
  logoText: { color: WHITE, fontWeight: 900, fontSize: 20, letterSpacing: 1.5 },
  logoSub: { color: "rgba(255,255,255,0.6)", fontSize: 9, letterSpacing: 3, textTransform: "uppercase" },
  logoPartner: { color: "rgba(255,255,255,0.85)", fontSize: 12, marginTop: 4, fontWeight: 700, letterSpacing: 0.3 },
  headerIcons: { display: "flex", gap: 8, alignItems: "center" },
  iconBtn: {
    background: "rgba(255,255,255,0.15)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: "8px 10px",
    cursor: "pointer",
    display: "flex",
    color: WHITE,
  },

  // ── Search bar (WhatsApp style)
  searchZone: {
    background: WHITE,
    padding: "10px 16px 0",
    borderBottom: `1px solid ${BORDER}`,
  },
  searchCard: { display: "none" },   // unused in this style
  searchPill: {
    display: "flex",
    alignItems: "center",
    background: "#F0F2F5",
    borderRadius: 10,
    padding: "0 12px",
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    padding: "11px 0",
    border: "none",
    outline: "none",
    color: TEXT,
    background: "transparent",
    fontSize: 15,
    fontFamily: "inherit",
    minWidth: 0,
  },
  searchFilterBtn: {
    background: RED,
    border: "none",
    borderRadius: 22,
    padding: "8px 14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 5,
    color: WHITE,
    flexShrink: 0,
    boxShadow: "0 2px 8px rgba(183,28,28,0.4)",
    fontFamily: "inherit",
  },
  filterRow: {
    display: "flex",
    gap: 8,
    overflowX: "auto",
    paddingBottom: 10,
    scrollbarWidth: "none",
    msOverflowStyle: "none",
  },
  filterChip: (active) => ({
    background: active ? "#FDE8E8" : "#F0F2F5",
    color: active ? RED : MUTED,
    border: "none",
    borderRadius: 24,
    padding: "7px 16px",
    fontSize: 13,
    fontWeight: active ? 800 : 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
    boxShadow: "none",
    fontFamily: "inherit",
  }),

  // ── Sections
  section: { padding: "18px 16px 0" },
  sectionRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontWeight: 800, fontSize: 17, color: TEXT },
  browseAll: { color: RED, fontSize: 13, fontWeight: 700, cursor: "pointer", background: "none", border: "none", fontFamily: "inherit" },

  // ── Car grid cards
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 },
  card: {
    background: CARD,
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: `1px solid ${BORDER}`,
  },
  cardImg: { width: "100%", height: 128, objectFit: "cover", background: "#EEE", display: "block" },
  noPhoto: {
    height: 128,
    background: "#F3F4F6",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#C4C4C4",
    fontSize: 11,
    gap: 6,
  },
  cardBody: { padding: "10px 12px 14px" },
  cardName: { fontWeight: 700, fontSize: 13, color: TEXT, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  cardPrice: { color: RED, fontWeight: 800, fontSize: 14, marginBottom: 6 },
  cardLoc: { display: "flex", alignItems: "center", gap: 4, color: MUTED, fontSize: 11, marginBottom: 10 },
  cardBtns: { display: "flex", gap: 6 },
  viewBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    border: `1.5px solid ${RED}`,
    borderRadius: 10,
    padding: "7px 0",
    color: RED,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    background: WHITE,
    fontFamily: "inherit",
  },
  saveBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    background: RED,
    border: "none",
    borderRadius: 10,
    padding: "7px 0",
    color: WHITE,
    fontSize: 11,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  badge: (type) => ({
    position: "absolute",
    top: 8,
    left: 8,
    background: type === "FEATURED" ? GOLD : "#16A34A",
    color: WHITE,
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 6,
    padding: "3px 8px",
    letterSpacing: 0.5,
    zIndex: 2,
    textTransform: "uppercase",
  }),
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    background: "rgba(255,255,255,0.95)",
    border: "none",
    borderRadius: 20,
    padding: "6px",
    cursor: "pointer",
    display: "flex",
    zIndex: 2,
    boxShadow: "0 1px 5px rgba(0,0,0,0.18)",
  },

  // ── Bottom nav (floating pill style)
  bottomNav: {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    width: "calc(100% - 32px)",
    maxWidth: 448,
    background: WHITE,
    borderRadius: 28,
    display: "flex",
    alignItems: "center",
    zIndex: 200,
    boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
    padding: "8px 10px",
    gap: 4,
    boxSizing: "border-box",
  },
  navItem: (active) => ({
    flex: active ? "0 0 auto" : 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: active ? 7 : 0,
    padding: active ? "10px 18px" : "10px 0",
    cursor: "pointer",
    color: active ? WHITE : "#9CA3AF",
    background: active ? RED : "transparent",
    border: "none",
    borderRadius: 22,
    fontSize: 13,
    fontWeight: 800,
    fontFamily: "inherit",
    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
    whiteSpace: "nowrap",
  }),
  navDot: { display: "none" },

  // ── Modals
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    zIndex: 500,
    display: "flex",
    alignItems: "flex-end",
  },
  modal: {
    background: WHITE,
    borderRadius: "24px 24px 0 0",
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    padding: "8px 20px 32px",
    maxHeight: "92vh",
    overflowY: "auto",
  },
  modalHandle: {
    width: 40,
    height: 4,
    background: "#E5E7EB",
    borderRadius: 2,
    margin: "10px auto 18px",
  },
  modalTitle: { fontWeight: 800, fontSize: 20, color: TEXT, marginBottom: 16 },

  // ── Forms
  input: {
    width: "100%",
    padding: "13px 14px",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 12,
    boxSizing: "border-box",
    outline: "none",
    color: TEXT,
    background: WHITE,
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "13px 14px",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 12,
    boxSizing: "border-box",
    background: WHITE,
    color: TEXT,
    fontFamily: "inherit",
  },
  textarea: {
    width: "100%",
    padding: "13px 14px",
    border: `1.5px solid ${BORDER}`,
    borderRadius: 12,
    fontSize: 14,
    marginBottom: 12,
    boxSizing: "border-box",
    resize: "vertical",
    minHeight: 90,
    outline: "none",
    color: TEXT,
    fontFamily: "inherit",
  },
  primaryBtn: {
    width: "100%",
    background: RED,
    color: WHITE,
    border: "none",
    borderRadius: 14,
    padding: "15px 0",
    fontSize: 15,
    fontWeight: 800,
    cursor: "pointer",
    marginBottom: 10,
    fontFamily: "inherit",
    letterSpacing: 0.3,
  },
  ghostBtn: {
    width: "100%",
    background: "transparent",
    color: RED,
    border: `2px solid ${RED}`,
    borderRadius: 14,
    padding: "13px 0",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: MUTED,
    marginBottom: 5,
    display: "block",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  errorTxt: { color: RED, fontSize: 12, marginBottom: 8, fontWeight: 600 },
  successTxt: { color: "#16A34A", fontSize: 12, marginBottom: 8 },
  pill: (on) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    background: on ? "#FFF0F0" : "#F3F4F6",
    color: on ? RED : MUTED,
    borderRadius: 20,
    padding: "5px 12px",
    fontSize: 12,
    fontWeight: 700,
  }),
  postFab: {
    position: "fixed",
    bottom: 92,
    right: 18,
    background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
    color: WHITE,
    border: "none",
    borderRadius: "50%",
    width: 62,
    height: 62,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 6px 24px rgba(183,28,28,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
    zIndex: 300,
  },

  // ── FAB flyout (choose: post a car in Uganda vs. post an import)
  fabMenuBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 295,
    background: "transparent",
  },
  fabMenu: {
    position: "fixed",
    bottom: 162,
    right: 18,
    zIndex: 301,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 10,
  },
  fabMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: CARD,
    border: `1px solid ${BORDER}`,
    borderRadius: 30,
    padding: "8px 16px 8px 8px",
    boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
    fontSize: 13,
    color: TEXT,
    whiteSpace: "nowrap",
  },
  fabMenuIcon: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // ── Imports tab
  importCard: {
    background: CARD,
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: `1px solid ${BORDER}`,
    marginBottom: 14,
  },
  importBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    background: "#1D4ED8",
    color: WHITE,
    fontSize: 9,
    fontWeight: 800,
    borderRadius: 6,
    padding: "3px 8px",
    letterSpacing: 0.5,
    zIndex: 2,
    textTransform: "uppercase",
  },
  importEtaRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: "#FFFBEB",
    border: "1px solid #FDE68A",
    borderRadius: 10,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 700,
    color: "#92400E",
    marginBottom: 10,
  },
  notifyBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    background: RED,
    border: "none",
    borderRadius: 12,
    padding: "11px 0",
    color: WHITE,
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

// ── TERMS & CONDITIONS ─────────────────────────────────────────────────────────
const TermsModal = ({ onAccept, onDecline }) => (
  <div style={S.modalOverlay}>
    <div style={{ ...S.modal, maxHeight: "85vh" }}>
      <div style={S.modalHandle} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 18 }}>Terms & Conditions</h2>
        <button onClick={onDecline} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="close" size={22} color={MUTED} />
        </button>
      </div>
      <div style={{ fontSize: 13.5, color: "#444", lineHeight: 1.75, marginBottom: 20 }}>
        <div style={{ background: "#FFF0F0", borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <p style={{ fontWeight: 800, color: RED, margin: 0, fontSize: 14 }}>Welcome to CAR-FLIX Uganda</p>
        </div>
        <p>CAR-FLIX is a third-party marketplace platform that helps connect car sellers with interested buyers from different parts of Africa.</p>
        <p>The role of CAR-FLIX is <strong>only to help link buyers and sellers</strong> and increase the visibility of listings to potential buyers.</p>
        <p>CAR-FLIX team members are <strong>not responsible</strong> for agreements made between buyers and sellers, including negotiations, payments, or transaction outcomes.</p>
        <p>If there are any illegalities concerning a listed vehicle — such as theft, fraud, or tax violations — the CAR-FLIX team is <strong>not liable</strong>. Such matters will be handled by the appropriate law enforcement authorities.</p>
        <p style={{ fontWeight: 600, color: "#333" }}>By registering, you confirm that you have read, understood, and agreed to these Terms & Conditions.</p>
      </div>
      <button onClick={onAccept} style={S.primaryBtn}>I Accept &amp; Continue</button>
      <button onClick={onDecline} style={S.ghostBtn}>Decline</button>
    </div>
  </div>
);

// ── WHATSAPP PICKER MODAL ──────────────────────────────────────────────────────
const WaPickerModal = ({ car, onClose }) => {
  const msg = `Hello 👋\n\nI'm interested in your *${car.carName}*\n\n💰 Price: UGX ${car.price}\n📍 Location: ${car.location}\n\n📸 View car:\n${car.images?.[0] || ""}`;
  const waColors = ["#16A34A", "#1D4ED8", "#EA580C"];
  const waBg = ["#F0FDF4", "#EFF6FF", "#FFF7ED"];
  return (
    <div style={S.modalOverlay}>
      <div style={S.modal}>
        <div style={S.modalHandle} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
          <h2 style={{ ...S.modalTitle, margin: 0, fontSize: 18 }}>Contact via WhatsApp</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon name="close" size={22} color={MUTED} />
          </button>
        </div>
        <p style={{ color: MUTED, fontSize: 13, marginBottom: 18 }}>Choose which line to message. All lines go to our CAR-FLIX team.</p>
        {WA_NUMBERS.map((wa, i) => (
          <button
            key={i}
            onClick={() => { window.open(`https://wa.me/${wa.number}?text=${encodeURIComponent(msg)}`, "_blank"); onClose(); }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              background: waBg[i],
              border: `1px solid ${waColors[i]}22`,
              borderRadius: 14,
              padding: "14px 16px",
              marginBottom: 10,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 22, background: waColors[i], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="whatsapp" size={22} color={WHITE} />
            </div>
            <div style={{ textAlign: "left", flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: TEXT }}>{wa.label}</p>
              <p style={{ fontSize: 13, color: MUTED, margin: 0 }}>{wa.display}</p>
            </div>
            <span style={{ color: MUTED, fontSize: 18 }}>›</span>
          </button>
        ))}
        <button style={{ ...S.ghostBtn, marginTop: 4 }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// ── AUTH MODAL ─────────────────────────────────────────────────────────────────
const AuthModal = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaToken, setCaptchaToken] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const savedEmail = localStorage.getItem("lastEmail");
    if (savedEmail) setForm((f) => ({ ...f, email: savedEmail }));
  }, []);

  const handleRegister = async () => {
    setErr("");
    setLoading(true);

    if (!captchaToken) {
      setLoading(false);
      return setErr("Please complete the captcha.");
    }

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
      options: {
        captchaToken,
      },
    });

console.log("AUTH USER ID:", data.user?.id);
console.log("USER:", data.user);
console.log("SESSION:", data.session);

if (error) {
  setLoading(false);
  return setErr(error.message);
}
    const { data: insertedUser, error: insertError } = await supabase
  .from("users")
  .insert([
    {
      id: data.user?.id,
      username: form.username,
      phone: form.phone,
      is_admin: false,
    },
  ])
  .select();

console.log("INSERTED USER:", insertedUser);
console.log("INSERT ERROR:", insertError);
    localStorage.setItem("lastEmail", form.email);
    setLoading(false);
    alert("Account created! Now login.");
    setMode("login");
  };

  const handleLogin = async () => {
    setErr("");
    setLoading(true);

    if (!captchaToken) {
      setLoading(false);
      return setErr("Please complete the captcha.");
    }
console.log("CAPTCHA TOKEN:", captchaToken);
    const { data, error } = await supabase.auth.signInWithPassword({
  email: form.email,
  password: form.password,
  options: {
    captchaToken,
  },
});

console.log("LOGIN DATA:", data);
console.log("LOGIN ERROR:", error);
    if (error) { setLoading(false); return setErr(error.message); }
    localStorage.setItem("lastEmail", form.email);
    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

onLogin(profile);
    setLoading(false);
  };

  return (
    <div style={S.modalOverlay}>
      <div style={S.modal}>
        <div style={S.modalHandle} />
        {/* Branding */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, background: RED, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>
            <Icon name="admin" size={26} color={WHITE} />
          </div>
          <h2 style={{ fontWeight: 900, fontSize: 20, color: TEXT, margin: "0 0 4px" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>
            {mode === "login" ? "Sign in to your CAR-FLIX account" : "Join CAR-FLIX Uganda today"}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", background: "#F3F4F6", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit", background: mode === m ? WHITE : "transparent", color: mode === m ? RED : MUTED, boxShadow: mode === m ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>
              {m === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {mode === "register" && (
          <>
            <label style={S.label}>Username</label>
            <input style={S.input} placeholder="e.g. john_doe" value={form.username} onChange={set("username")} />
            <label style={S.label}>Phone Number</label>
            <input style={S.input} placeholder="e.g. 0701234567" value={form.phone} onChange={set("phone")} />
          </>
        )}

        <label style={S.label}>Email Address</label>
        <input style={S.input} placeholder="your@email.com" value={form.email} onChange={set("email")} />

        <label style={S.label}>Password</label>
        <div style={{ position: "relative", marginBottom: 0 }}>
          <input
            style={{ ...S.input, paddingRight: 52 }}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={form.password}
            onChange={set("password")}
          />
          <button onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-60%)", background: "none", border: "none", cursor: "pointer", color: MUTED, fontSize: 12, fontWeight: 700, fontFamily: "inherit" }}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {mode === "register" && (
          <>
            <label style={{ ...S.label, marginTop: 0 }}>Confirm Password</label>
            <input style={S.input} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={set("confirmPassword")} />
          </>
        )}

        {err && (
          <div style={{ background: "#FFF0F0", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <p style={{ ...S.errorTxt, margin: 0 }}>{err}</p>
          </div>
        )}

        {!captchaReady && (
          <p style={{ textAlign: "center", fontSize: 14 }}>
            Loading security check...
          </p>
          )}

        <Turnstile
          siteKey="0x4AAAAAADoR_esu9IS5h92R"
          onLoad={() => {
            setCaptchaReady(true);
          }}
          onSuccess={(token) => {
            console.log("TURNSTILE TOKEN:", token);
            setCaptchaToken(token);
          }}
        />

        <button
          style={{ ...S.primaryBtn, marginTop: 8, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          disabled={loading || !form.email || !form.password}
          onClick={mode === "login" ? handleLogin : handleRegister}
        >
          {loading ? (mode === "login" ? "Signing in…" : "Creating account…") : (mode === "login" ? "Sign In" : "Create Account")}
        </button>

        <button onClick={onClose} style={{ ...S.ghostBtn, marginTop: 4 }}>Cancel</button>
      </div>
    </div>
  );
};

// ── CAR DETAIL PAGE ────────────────────────────────────────────────────────────
const CarDetail = ({ car, user, onBack, savedIds, onToggleSave, onWhatsAppInquiry }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const saved = savedIds.includes(car.id);
  const imgs = car.images && car.images.length > 0 ? car.images : null;

  return (
    <div style={{ background: SURFACE, minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ ...S.header, position: "sticky", top: 0 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex" }}>
          <Icon name="back" size={22} color={WHITE} />
        </button>
        <span style={{ ...S.logoText, fontSize: 16, letterSpacing: 0.5 }}>Car Details</span>
        <button onClick={() => onToggleSave(car.id)} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 10, padding: "8px 10px", cursor: "pointer", display: "flex" }}>
          <Icon name={saved ? "heart" : "heart-outline"} size={22} color={WHITE} />
        </button>
      </div>

      {/* Hero image */}
      <div style={{ position: "relative", background: "#EEE" }}>
        {imgs ? (
          <img src={imgs[imgIdx]} alt={car.carName} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ height: 260, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#AAA", gap: 10, background: "#F0F0F0" }}>
            <Icon name="photo" size={52} color="#CCC" />
            <span style={{ fontSize: 14, color: MUTED }}>No photos available</span>
          </div>
        )}
        {/* Dot indicators */}
        {imgs && imgs.length > 1 && (
          <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
            {imgs.map((_, i) => (
              <div key={i} onClick={() => setImgIdx(i)}
                style={{ width: i === imgIdx ? 22 : 8, height: 8, borderRadius: 4, background: i === imgIdx ? WHITE : "rgba(255,255,255,0.5)", cursor: "pointer", transition: "all 0.2s" }} />
            ))}
          </div>
        )}
        {/* Featured badge */}
        {car.featured && (
          <div style={{ position: "absolute", top: 14, left: 14, background: GOLD, color: WHITE, fontSize: 11, fontWeight: 800, padding: "5px 12px", borderRadius: 8 }}>
            ⭐ FEATURED
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {imgs && imgs.length > 1 && (
        <div style={{ display: "flex", gap: 8, padding: "12px 16px", overflowX: "auto", background: WHITE, scrollbarWidth: "none" }}>
          {imgs.map((img, i) => (
            <img key={i} src={img} alt="" onClick={() => setImgIdx(i)}
              style={{ width: 68, height: 54, objectFit: "cover", borderRadius: 10, cursor: "pointer", border: i === imgIdx ? `2.5px solid ${RED}` : "2.5px solid transparent", flexShrink: 0 }} />
          ))}
        </div>
      )}

      {/* Info card */}
      <div style={{ background: WHITE, margin: "12px 16px", borderRadius: 18, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: TEXT, flex: 1, lineHeight: 1.3 }}>{car.carName}</h2>
          <span style={S.pill(true)}>{car.condition}</span>
        </div>
        <p style={{ color: RED, fontWeight: 900, fontSize: 24, margin: "6px 0 10px", letterSpacing: -0.5 }}>{formatPrice(car.price)}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: MUTED, fontSize: 14, marginBottom: 14 }}>
          <Icon name="location" size={16} color={MUTED} />{car.location}
        </div>

        {/* Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          {[["Brand", car.brand], ["Condition", car.condition], ["Location", car.location]].map(([k, v]) => (
            <div key={k} style={{ background: SURFACE, borderRadius: 12, padding: "10px 14px", border: `1px solid ${BORDER}` }}>
              <p style={{ color: MUTED, fontSize: 10, fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase", letterSpacing: 0.6 }}>{k}</p>
              <p style={{ color: TEXT, fontSize: 14, fontWeight: 800, margin: 0 }}>{v}</p>
            </div>
          ))}
        </div>

        {/* Description */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
          <p style={{ fontWeight: 800, fontSize: 14, color: TEXT, marginBottom: 8, marginTop: 0 }}>Description</p>
          <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.75, margin: 0 }}>{car.description}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: "0 16px 32px" }}>
        <button
          onClick={() => onWhatsAppInquiry(car)}
          style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "#16A34A", borderRadius: 16, fontSize: 16 }}
        >
          <Icon name="whatsapp" size={22} color={WHITE} />
          Contact Seller on WhatsApp
        </button>
        <button
          onClick={() => onToggleSave(car.id)}
          style={{ ...S.ghostBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16 }}
        >
          <Icon name={saved ? "heart" : "heart-outline"} size={18} color={RED} />
          {saved ? "Saved to Wishlist" : "Save Car"}
        </button>
      </div>
    </div>
  );
};

// ── POST CAR MODAL ─────────────────────────────────────────────────────────────
const PostCarModal = ({ user, onClose, onSave, carToEdit }) => {
  const [form, setForm] = useState(carToEdit || { carName: "", brand: "Toyota", price: "", location: "", condition: "Used", description: "", images: [] });
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);

  if (form.images.length + files.length > 7) {
    return setErr("Maximum 7 images allowed");
  }

  setUploading(true);

  let uploadedUrls = [];

  const options = {
    maxSizeMB: 0.35,          // Maximum 350KB
    maxWidthOrHeight: 1600,   // Resize if larger than 1600px
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    for (const file of files) {

      // Compress image
      const compressedFile = await imageCompression(file, options);

      console.log(
        "Original:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );

      console.log(
        "Compressed:",
        (compressedFile.size / 1024).toFixed(0),
        "KB"
      );

      const fileName = `${Date.now()}-${compressedFile.name}`;

      const { error } = await supabase.storage
        .from("cars")
        .upload(fileName, compressedFile);

      if (error) {
        setUploading(false);
        return setErr("Upload failed");
      }

      const { data } = supabase.storage
        .from("cars")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));

    e.target.value = "";

  } catch (err) {
    console.error(err);
    setErr("Image compression failed.");
  }

  setUploading(false);
};

  const removeImg = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const save = async () => {
    if (form.images.length === 0) return setErr("Please upload at least one image.");
    setErr("");
    console.log("FINAL IMAGES BEING SAVED:", form.images);
    if (!form.carName || !form.price || !form.location || !form.description) return setErr("Please fill all required fields.");

    if (carToEdit) {
      const { error } = await supabase.from("cars").update({ carName: form.carName, brand: form.brand, price: Number(form.price), location: form.location, condition: form.condition, description: form.description, images: form.images }).eq("id", carToEdit.id);
      if (error) return setErr(error.message);
    } else {
      console.log("FORM IMAGES BEFORE SAVE:", form.images);
      const { data, error } = await supabase.from("cars").insert([{ carName: form.carName, brand: form.brand, price: Number(form.price), location: form.location, condition: form.condition, description: form.description, images: form.images, owner_id: user.id, owner_phone: user.phone, featured: false }]).select();
      console.log("INSERT DATA:", data);
      console.log("INSERT ERROR:", error);
      if (error) return setErr(error.message);
    }
    await onSave();
    onClose();
  };

  return (
    <div style={S.modalOverlay}>
      <div style={{ ...S.modal, maxHeight: "92vh" }}>
        <div style={S.modalHandle} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ ...S.modalTitle, margin: 0 }}>{carToEdit ? "Edit Listing" : "Post a Car"}</h2>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
            <Icon name="close" size={20} color={MUTED} />
          </button>
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
        <textarea style={S.textarea} placeholder="Describe the car…" value={form.description} onChange={set("description")} />

        <label style={S.label}>Photos (max 7)</label>
        <label style={{ display: "block", background: "#F9FAFB", border: `2px dashed ${BORDER}`, borderRadius: 12, padding: "16px", textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
          <Icon name="photo" size={24} color={MUTED} />
          <p style={{ margin: "6px 0 0", fontSize: 13, color: MUTED, fontWeight: 600 }}>
            {uploading ? "Uploading…" : "Tap to upload images"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#C4C4C4" }}>{form.images.length}/7 photos added</p>
        </label>

        {form.images.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={img} alt="" style={{ width: 70, height: 56, objectFit: "cover", borderRadius: 10, border: `2px solid ${BORDER}` }} />
                <button onClick={() => removeImg(i)} style={{ position: "absolute", top: -5, right: -5, background: RED, border: "none", borderRadius: 10, width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="close" size={10} color={WHITE} />
                </button>
              </div>
            ))}
          </div>
        )}

        {err && (
          <div style={{ background: "#FFF0F0", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <p style={{ ...S.errorTxt, margin: 0 }}>{err}</p>
          </div>
        )}

        <button style={{ ...S.primaryBtn, opacity: uploading ? 0.7 : 1 }} onClick={save} disabled={uploading}>
          {uploading ? "Uploading images…" : carToEdit ? "Save Changes" : "Post Car"}
        </button>
        <button style={S.ghostBtn} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// ── POST IMPORT MODAL ───────────────────────────────────────────────────────────
// Mirrors PostCarModal's shell/fields, but for cars still en route (not in Uganda yet).
// TODO(backend): once a real `imports` table exists, swap `onSave(newImport)` below
// for `await supabase.from("imports").insert([...]).select()`, the same way
// PostCarModal writes to `cars`. For now this only updates local `imports` state
// (passed in as `onSave`), so submissions don't persist across a page refresh.
const PostImportModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState({ carName: "", brand: "Toyota", price: "", originCountry: "", expectedArrival: "", condition: "Foreign Used", description: "", images: [] });
  const [err, setErr] = useState("");
  const [uploading, setUploading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const [currentUser, setCurrentUser] = useState(null);

useEffect(() => {
  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (!data?.user) return;

const { data: profile, error } = await supabase
  .from("users")
  .select("*")
  .eq("id", data.user.id)
  .single();

if (error) {
  console.error(error);
  return;
}

setCurrentUser(profile);

console.log("PROFILE:", profile);
  };

  loadUser();
}, []);

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);

  if (form.images.length + files.length > 7) {
    return setErr("Maximum 7 images allowed");
  }

  setUploading(true);

  let uploadedUrls = [];

  const options = {
    maxSizeMB: 0.35,          // Compress to around 350KB
    maxWidthOrHeight: 1600,   // Resize large images
    useWebWorker: true,
    initialQuality: 0.8,
  };

  try {
    for (const file of files) {

      // Compress image
      const compressedFile = await imageCompression(file, options);

      console.log(
        "Original:",
        (file.size / 1024 / 1024).toFixed(2),
        "MB"
      );

      console.log(
        "Compressed:",
        (compressedFile.size / 1024).toFixed(0),
        "KB"
      );

      const fileName = `${Date.now()}-${compressedFile.name}`;

      const { error } = await supabase.storage
        .from("imports")
        .upload(fileName, compressedFile);

      if (error) {
        setUploading(false);
        return setErr("Upload failed");
      }

      const { data } = supabase.storage
        .from("imports")
        .getPublicUrl(fileName);

      uploadedUrls.push(data.publicUrl);
    }

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploadedUrls],
    }));

    e.target.value = "";

  } catch (err) {
    console.error(err);
    setErr("Image compression failed.");
  }

  setUploading(false);
};

  const removeImg = (i) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const save = async () => {
  setErr("");

  if (
  !form.carName ||
  !form.price ||
  !form.originCountry ||
  !form.expectedArrival ||
  !form.description
) {
  return setErr("Please fill all required fields.");
}

console.log("CURRENT USER:", currentUser);

  if (!currentUser) {
    return setErr("You must be logged in.");
  }

  const { data, error } = await supabase
    .from("imports")
    .insert([
      {
        owner_id: currentUser.id,

        car_name: form.carName,
        brand: form.brand,
        price: Number(form.price),

        importing_from: form.originCountry,

        expected_arrival: form.expectedArrival,

        condition: form.condition,

        description: form.description,

        images: form.images,

        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return setErr(error.message);
  }

  console.log("CURRENT IMPORT USER:", currentUser);

  onSave(data);

  onClose();
};
  return (
    <div style={S.modalOverlay}>
      <div style={{ ...S.modal, maxHeight: "92vh" }}>
        <div style={S.modalHandle} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ ...S.modalTitle, margin: 0 }}>Post an Import</h2>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
            <Icon name="close" size={20} color={MUTED} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "8px 10px", marginBottom: 16, fontSize: 12, color: "#1D4ED8", fontWeight: 600 }}>
          <Icon name="shipping" size={14} color="#1D4ED8" /> This lists under the "Imports" tab, not the main listings.
        </div>

        <label style={S.label}>Car Name *</label>
        <input style={S.input} placeholder="e.g. Toyota Alphard 2022" value={form.carName} onChange={set("carName")} />

        <label style={S.label}>Brand *</label>
        <select style={S.select} value={form.brand} onChange={set("brand")}>
          {BRANDS.filter(b => b !== "All").map(b => <option key={b}>{b}</option>)}
        </select>

        <label style={S.label}>Price (UGX) *</label>
        <input style={S.input} type="number" placeholder="e.g. 145000000" value={form.price} onChange={set("price")} />

        <label style={S.label}>Origin Country *</label>
        <input style={S.input} placeholder="e.g. Japan, UAE, UK" value={form.originCountry} onChange={set("originCountry")} />

        <label style={S.label}>Expected Arrival *</label>
        <input style={S.input} placeholder="e.g. Aug 2026" value={form.expectedArrival} onChange={set("expectedArrival")} />

        <label style={S.label}>Condition</label>
        <select style={S.select} value={form.condition} onChange={set("condition")}>
          {["New", "Foreign Used", "Local Used"].map(c => <option key={c}>{c}</option>)}
        </select>

        <label style={S.label}>Description *</label>
        <textarea style={S.textarea} placeholder="Describe the car…" value={form.description} onChange={set("description")} />

        <label style={S.label}>Photos (max 7, optional)</label>
        <label style={{ display: "block", background: "#F9FAFB", border: `2px dashed ${BORDER}`, borderRadius: 12, padding: "16px", textAlign: "center", cursor: "pointer", marginBottom: 12 }}>
          <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
          <Icon name="photo" size={24} color={MUTED} />
          <p style={{ margin: "6px 0 0", fontSize: 13, color: MUTED, fontWeight: 600 }}>
            {uploading ? "Uploading…" : "Tap to upload images"}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#C4C4C4" }}>{form.images.length}/7 photos added</p>
        </label>

        {form.images.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {form.images.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={img} alt="" style={{ width: 70, height: 56, objectFit: "cover", borderRadius: 10, border: `2px solid ${BORDER}` }} />
                <button onClick={() => removeImg(i)} style={{ position: "absolute", top: -5, right: -5, background: RED, border: "none", borderRadius: 10, width: 18, height: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name="close" size={10} color={WHITE} />
                </button>
              </div>
            ))}
          </div>
        )}

        {err && (
          <div style={{ background: "#FFF0F0", borderRadius: 10, padding: "10px 12px", marginBottom: 12 }}>
            <p style={{ ...S.errorTxt, margin: 0 }}>{err}</p>
          </div>
        )}

        <button style={{ ...S.primaryBtn, opacity: uploading ? 0.7 : 1 }} onClick={save} disabled={uploading}>
          {uploading ? "Uploading images…" : "Post Import"}
        </button>
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
        <div style={S.modalHandle} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ ...S.modalTitle, margin: 0 }}>Filter Cars</h2>
          <button onClick={onClose} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, padding: 8, cursor: "pointer", display: "flex" }}>
            <Icon name="close" size={20} color={MUTED} />
          </button>
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
        <button style={S.ghostBtn} onClick={() => { const reset = { brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" }; onChange(reset); onClose(); }}>Reset Filters</button>
      </div>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────────────────────
export default function CarFlixApp() {
  window.onerror = function (msg, url, line, col, error) { alert("ERROR: " + msg); };

  const [showTerms, setShowTerms] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const [user, setUser] = useState(null);
  console.log("CURRENT USER:", user);
  const [showAuth, setShowAuth] = useState(false);
  const [tab, setTab] = useState("home");
  const [cars, setCars] = useState([]);

  const [featuredCars, setFeaturedCars] = useState([]);

  const PAGE_SIZE = 20;

  const [page, setPage] = useState(0);

  const [hasMoreCars, setHasMoreCars] = useState(true);

  const [loadingCars, setLoadingCars] = useState(false);

  const loaderRef = useRef(null);

  const isFetchingRef = useRef(false);

  const observerTriggered = useRef(false);

  const [loadingImports, setLoadingImports] = useState(false);

  

  const deleteCar = async (id) => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    const { error } = await supabase.from("cars").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await refresh();
  };

  // New: mirrors deleteCar above, but for the "imports" table.
  const deleteImport = async (id) => {
    if (!window.confirm("Are you sure you want to delete this import?")) return;
    const { error } = await supabase.from("imports").delete().eq("id", id);
    if (error) { alert(error.message); return; }
    await fetchImports();
  };

  const [savedIds, setSavedIds] = useState([]);
  useEffect(() => {

  const loadSavedCars = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("saved_cars")
      .select("car_id")
      .eq("user_id", user.id);

    if (!error && data) {
      setSavedIds(data.map(item => item.car_id));
    }
  };

  loadSavedCars();

}, [user]);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState("All");
  const [showImportSearch, setShowImportSearch] = useState(false); // collapsible search toggle, Imports tab only
  const [importSearch, setImportSearch] = useState("");
  const [importBrandFilter, setImportBrandFilter] = useState("All");
  const [filters, setFilters] = useState({ brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" });
  const [showFilter, setShowFilter] = useState(false);
  const [showPost, setShowPost] = useState(false);
  const [showPostImport, setShowPostImport] = useState(false); // new: "Post an import" modal
  const [showFabMenu, setShowFabMenu] = useState(false); // new: FAB flyout (choose Uganda car vs import)
  const fetchImports = async () => {
  setLoadingImports(true);

  const { data, error } = await supabase
    .from("imports")
    .select("*, users(phone)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("IMPORT FETCH ERROR:", error);
    setLoadingImports(false);
    return;
  }

  const normalised = (data || []).map(row => ({
    ...row,
    carName: row.car_name || row.carName || "",
    originCountry: row.importing_from || row.originCountry || "",
    expectedArrival: row.expected_arrival || row.expectedArrival || "",
    owner_phone: row.users?.phone || row.owner_phone || null,
  }));

  console.log("IMPORTS FROM DB (normalised):", normalised);

  setImports(normalised);

  setLoadingImports(false);
};
  useEffect(() => {
  fetchImports();
}, []);
  const [imports, setImports] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [editCar, setEditCar] = useState(null);
  const [manageTab, setManageTab] = useState("cars"); // new: "My Cars" / "My Imports" segmented toggle inside the My Listings tab
  const [showAdmin, setShowAdmin] = useState(false);
  const [showWaPicker, setShowWaPicker] = useState(false);
  const [waCarContext, setWaCarContext] = useState(null);

  // Inject font
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap";
    document.head.appendChild(link);
    return () => { try { document.head.removeChild(link); } catch (_) {} };
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
        console.log("FETCHED PROFILE", profile);
        setUser(profile);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    console.log(error);
    return;
  }

  console.log("ALL USERS:", data);

  setUsers(data || []);
};

}, []);
useEffect(() => {
  const fetchInquiries = async () => {
    const { data, error } = await supabase
      .from("inquiries")
      .select("*");

    if (error) {
      console.log("INSERT ERROR", error);
      alert(error.message);
      return;
    }

    console.log("ALL INQUIRIES:", data);
  };

  fetchInquiries();
}, []);



const handleWhatsAppInquiry = async (car) => {
  try {
    console.log("STEP 1");

    const { data: authData } = await supabase.auth.getUser();
    console.log("STEP 2", authData);

    if (!authData.user) {
      alert("Please log in to contact the seller.");
      return;
    }

    console.log("STEP 3");

    const buyerId = authData.user.id;

    console.log("STEP 4");

    const { error: sellerInquiryError } = await supabase
      .from("seller_inquiries")
      .insert([
        {
          car_id: car.id,
          seller_id: car.owner_id,
          buyer_id: buyerId,
          inquiry_method: "whatsapp",
        },
      ]);

    console.log("STEP 5");

    if (sellerInquiryError) {
      console.error(sellerInquiryError);
      return;
    }

    console.log("STEP 6 - BEFORE EDGE FUNCTION");

    const response = await supabase.functions.invoke(
      "send-telegram-notification",
      {
        body: {
          buyer: buyerId,
          seller: car.owner_id,
          car: car.carName,
          price: car.price,
        },
      }
    );

    console.log("STEP 7 - AFTER EDGE FUNCTION");
    console.log(response);

  



    // save inquiry
    const { error } = await supabase
      .from("inquiries")
      .insert([
        {
          car_id: car.id,
          buyer_id: buyerId,
          seller_id: car.owner_id,
          name: authData?.user?.user_metadata?.username || "Guest",
          phone: authData?.user?.phone || "",
          messages: `Interested in ${car.carName}`,
        }
      ]);

    if (error) {
      console.log("Inquiry insert error:", error);
    }

    // open whatsapp
    const phone = car.owner_phone.startsWith("0")
      ? "256" + car.owner_phone.slice(1)
      : car.owner_phone;

    const msg = `Hello 👋

    I'm interested in your *${car.carName}*

    💰 Price: UGX ${car.price}
    📍 Location: ${car.location}

    📸 View car:
    ${car.images?.[0] || ""}`;

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );

  } catch (err) {
    console.log(err);
  }
};

  
  const fetchCars = async (pageNumber = 0) => {

  console.log("fetchCars called", pageNumber);

  if (isFetchingRef.current) return;

  isFetchingRef.current = true;
  setLoadingCars(true);

  const from = pageNumber * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data, error } = await supabase
  .from("cars")
  .select("*")
  .order("created_at", { ascending: false })
  .range(from, to);

  console.log("Supabase returned:", data);
  console.log("Supabase error:", error);


  if (error) {
    console.error(error);
    isFetchingRef.current = false;
    setLoadingCars(false);
    return;
  }

  console.log("Loaded cars:", data);

  if (pageNumber === 0) {
    setCars(data || []);
  } else {
    setCars(prev => [...prev, ...(data || [])]);
  }

  console.log("Returned:", data.length);
  console.log("Current page:", pageNumber);

  if (data.length < PAGE_SIZE) {
    console.log("NO MORE PAGES");
    setHasMoreCars(false);
  }

  if (!data || data.length < PAGE_SIZE) {
    setHasMoreCars(false);
  }
  isFetchingRef.current = false;
  setLoadingCars(false);
};

const fetchFeaturedCars = async () => {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setFeaturedCars(data || []);
};

useEffect(() => {
  fetchCars(page);
}, [page]);

useEffect(() => {
  if (!loaderRef.current) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];

      if (
        entry.isIntersecting &&
        hasMoreCars &&
        !loadingCars &&
        !observerTriggered.current
      ) {
        observerTriggered.current = true;
        setPage((prev) => prev + 1);
      }

      if (!entry.isIntersecting) {
        observerTriggered.current = false;
      }
    },
    {
      threshold: 1.0,
      rootMargin: "300px",
    }
  );

  observer.observe(loaderRef.current);

  return () => observer.disconnect();
}, [hasMoreCars, loadingCars]);

useEffect(() => {
  fetchFeaturedCars();
}, []);

  const openWa = (car = null) => { setWaCarContext(car); setShowWaPicker(true); };

  const refresh = async () => {
  setCars([]);
  setHasMoreCars(true);
  setPage(0);

  fetchCars(0);
};

  const toggleSave = async (carId) => {
  if (!user) {
    alert("Please login first");
    return;
  }

  const alreadySaved = savedIds.includes(carId);

  if (alreadySaved) {

    const { error } = await supabase
      .from("saved_cars")
      .delete()
      .eq("user_id", user.id)
      .eq("car_id", carId);

    if (!error) {
      setSavedIds(savedIds.filter(id => id !== carId));
    }

  } else {

    const { error } = await supabase
      .from("saved_cars")
      .insert([
        {
          user_id: user.id,
          car_id: carId
        }
      ]);

    if (!error) {
      setSavedIds([...savedIds, carId]);
    }
  }
};
  const login = (profile) => {
    setUser(profile);
    setShowAuth(false);
};

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedIds([]);
    setTab("home");
  };

  const acceptTerms = () => { setShowTerms(false); };

  const filtered = cars.filter(c => {
    const q = search.toLowerCase();
    if (q && !c.carName.toLowerCase().includes(q) && !c.brand.toLowerCase().includes(q) && !c.location.toLowerCase().includes(q) && !String(c.price).includes(q)) return false;
    const b = brandFilter !== "All" ? brandFilter : filters.brand !== "All" ? filters.brand : null;
    if (b && c.brand !== b) return false;
    if (filters.condition !== "Any Condition" && c.condition !== filters.condition) return false;
    if (filters.location && !c.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.minPrice && c.price < Number(filters.minPrice)) return false;
    if (filters.maxPrice && c.price > Number(filters.maxPrice)) return false;
    if (c.featured) return false;
    return true;
  });

  //const featuredCars = cars.filter(car => car.featured);
  const savedCars = cars.filter(c => savedIds.includes(c.id));
  const myCars = user ? cars.filter(c => c.owner_id === user.id) : [];
  const myImports = user ? imports.filter(c => c.owner_id === user.id) : []; // new: mirrors myCars, for the My Imports segment

  const filteredImports = imports.filter(c => {
    const q = importSearch.toLowerCase();
    if (q && !c.carName.toLowerCase().includes(q) && !c.brand.toLowerCase().includes(q) && !c.originCountry.toLowerCase().includes(q) && !String(c.price).includes(q)) return false;
    if (importBrandFilter !== "All" && c.brand !== importBrandFilter) return false;
    return true;
  });

  if (selectedCar) return (
    <CarDetail car={selectedCar} user={user} onBack={() => setSelectedCar(null)} savedIds={savedIds} onToggleSave={toggleSave} onWhatsAppInquiry={handleWhatsAppInquiry} />
  );

  // ── Car card (grid)
  const CarCard = ({ car }) => (
    <div style={S.card}>
      <div style={{ position: "relative" }}>
        {Array.isArray(car.images) && car.images.length > 0 ? (
          <img src={car.images[0]} alt={car.carName} style={S.cardImg} />
        ) : (
          <div style={S.noPhoto}>
            <Icon name="photo" size={28} color="#D1D5DB" />
            <span>No photo</span>
          </div>
        )}
        {car.featured && <span style={S.badge("FEATURED")}>⭐ Featured</span>}
        {car.badge && !car.featured && <span style={S.badge("NEW")}>{car.badge}</span>}
        <button onClick={() => toggleSave(car.id)} style={S.heartBtn}>
          <Icon name={savedIds.includes(car.id) ? "heart" : "heart-outline"} size={17} color={savedIds.includes(car.id) ? RED : "#9CA3AF"} />
        </button>
      </div>
      <div style={S.cardBody}>
        <p style={S.cardName}>{car.carName}</p>
        <p style={S.cardPrice}>{formatPrice(car.price)}</p>
        <div style={S.cardLoc}><Icon name="location" size={12} color="#C4C4C4" />{car.location}</div>
        <div style={S.cardBtns}>
          <button style={S.viewBtn} onClick={() => setSelectedCar(car)}>
            <Icon name="eye" size={13} color={RED} />View
          </button>
          <button style={S.saveBtn} onClick={() => toggleSave(car.id)}>
            <Icon name={savedIds.includes(car.id) ? "heart" : "heart-outline"} size={13} color={WHITE} />Save
          </button>
        </div>
      </div>
    </div>
  );

  // ── Featured card (horizontal scroll)
  const FeaturedCard = ({ car }) => (
    <div
      onClick={() => setSelectedCar(car)}
      style={{
        minWidth: 210,
        maxWidth: 210,
        background: CARD,
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
        border: `1px solid ${BORDER}`,
        flexShrink: 0,
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative" }}>
        {Array.isArray(car.images) && car.images.length > 0 ? (
          <img src={car.images[0]} alt={car.carName} style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ height: 140, background: "#F3F4F6", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <Icon name="photo" size={32} color="#D1D5DB" />
            <span style={{ fontSize: 11, color: "#C4C4C4" }}>No photo</span>
          </div>
        )}
        {/* Gold featured badge */}
        <div style={{ position: "absolute", top: 10, left: 10, background: GOLD, color: WHITE, fontSize: 10, fontWeight: 800, padding: "4px 10px", borderRadius: 8, letterSpacing: 0.3 }}>
          ⭐ FEATURED
        </div>
        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleSave(car.id); }}
          style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.95)", border: "none", borderRadius: 20, padding: "6px", cursor: "pointer", display: "flex", boxShadow: "0 1px 5px rgba(0,0,0,0.2)" }}
        >
          <Icon name={savedIds.includes(car.id) ? "heart" : "heart-outline"} size={16} color={savedIds.includes(car.id) ? RED : "#9CA3AF"} />
        </button>
      </div>
      <div style={{ padding: "12px 14px 14px" }}>
        <p style={{ fontWeight: 800, fontSize: 13, color: TEXT, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.carName}</p>
        <p style={{ color: RED, fontWeight: 900, fontSize: 15, margin: "0 0 6px" }}>{formatPrice(car.price)}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color: MUTED, fontSize: 11, marginBottom: 12 }}>
          <Icon name="location" size={12} color={MUTED} />{car.location}
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedCar(car); }}
          style={{ width: "100%", background: RED, color: WHITE, border: "none", borderRadius: 10, padding: "9px 0", fontSize: 12, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}
        >
          View Details
        </button>
      </div>
    </div>
  );

  // ── Import card (Imports tab — multi-image swipe, no "View" since car isn't in-country yet)
  function ImportCard({ car }) {
    const [imgIdx, setImgIdx] = useState(0);
    const imgs = Array.isArray(car.images) && car.images.length > 0 ? car.images : null;
    return (
    <div style={S.importCard}>
      <div style={{ position: "relative", background: "#EEE" }}>
        {imgs ? (
          <>
            <img src={imgs[imgIdx]} alt={car.carName} style={S.cardImg} />
            {/* Prev / Next arrows — only when more than 1 image */}
            {imgs.length > 1 && (
              <>
                <button
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + imgs.length) % imgs.length); }}
                  style={{ position: "absolute", left: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.38)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                </button>
                <button
                  onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % imgs.length); }}
                  style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.38)", border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3, padding: 0 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                </button>
                {/* Dot indicators */}
                <div style={{ position: "absolute", bottom: 7, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 5, zIndex: 3 }}>
                  {imgs.map((_, i) => (
                    <div key={i} onClick={e => { e.stopPropagation(); setImgIdx(i); }}
                      style={{ width: i === imgIdx ? 18 : 6, height: 6, borderRadius: 3, background: i === imgIdx ? WHITE : "rgba(255,255,255,0.55)", cursor: "pointer", transition: "all 0.2s" }} />
                  ))}
                </div>
                {/* Image counter badge */}
                <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.5)", borderRadius: 10, padding: "2px 7px", fontSize: 10, color: WHITE, fontWeight: 700, zIndex: 3 }}>
                  {imgIdx + 1}/{imgs.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div style={S.noPhoto}>
            <Icon name="photo" size={28} color="#D1D5DB" />
            <span>No photo yet</span>
          </div>
        )}
        <span style={S.importBadge}>✈️ Importing</span>
      </div>
      <div style={{ padding: "12px 14px 16px" }}>
        {/* Car name + brand */}
        <p style={{ fontWeight: 800, fontSize: 15, color: TEXT, margin: "0 0 2px", lineHeight: 1.3 }}>{car.carName}</p>
        <p style={{ fontSize: 12, color: MUTED, fontWeight: 600, margin: "0 0 6px" }}>{car.brand}</p>
        {/* Price */}
        <p style={{ color: RED, fontWeight: 900, fontSize: 16, margin: "0 0 8px" }}>{formatPrice(car.price)}</p>
        {/* ETA row */}
        <div style={S.importEtaRow}>
          <Icon name="shipping" size={13} color="#92400E" />
          ETA {car.expectedArrival} · from {car.originCountry}
        </div>
        {/* Condition pill */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <span style={{ background: "#EFF6FF", color: "#1D4ED8", fontSize: 11, fontWeight: 700, borderRadius: 20, padding: "4px 10px", border: "1px solid #BFDBFE" }}>
            {car.condition}
          </span>
        </div>
        {/* Description */}
        {car.description ? (
          <p style={{ fontSize: 12, color: MUTED, lineHeight: 1.6, margin: "0 0 12px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {car.description}
          </p>
        ) : null}
        {/* Notify Me — opens seller's WhatsApp */}
        <button
          style={S.notifyBtn}
          onClick={() => {
            if (!car.owner_phone) { alert("Seller contact not available"); return; }
            const raw = String(car.owner_phone).trim();
            const phone = raw.startsWith("0") ? "256" + raw.slice(1) : raw.replace(/^\+/, "");
            const msg = `Hello 👋

I saw your import listing on CAR-FLIX Uganda:

🚗 ${car.carName}
💰 ${formatPrice(car.price)}
✈️ Arriving: ${car.expectedArrival || "TBA"} from ${car.originCountry || "TBA"}

I'm interested — please keep me posted!`; 

            window.open(
              "https://wa.me/" + phone + "?text=" + encodeURIComponent(msg),
              "_blank"
            );
          }}
        >
          <Icon name="whatsapp" size={15} color={WHITE} /> Notify Me
        </button>
      </div>
    </div>
    );
  }

  
  return (
    <BrowserRouter>
      <Routes>

        {/* MAIN APP */}
        <Route
          path="/"
          element={
            <div>
              <div style={S.app}>
                {/* Modals */}
                {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={login} setShowTerms={setShowTerms} setPendingUser={setPendingUser} />}
                {showTerms && <TermsModal onAccept={acceptTerms} onDecline={() => setShowTerms(false)} />}
                {showFilter && <FilterPanel filters={filters} onChange={f => { setFilters(f); if (f.brand !== "All") setBrandFilter(f.brand); }} onClose={() => setShowFilter(false)} />}
                {(showPost || editCar) && user && <PostCarModal user={user} carToEdit={editCar} onClose={() => { setShowPost(false); setEditCar(null); }} onSave={async () => { await refresh(); setShowPost(false); setEditCar(null); }} />}
                {showPostImport && user && <PostImportModal onClose={() => setShowPostImport(false)} onSave={(newImport) => setImports((prev) => [newImport, ...prev])} />}
                {showWaPicker && <WaPickerModal car={waCarContext} onClose={() => setShowWaPicker(false)} />}

                {/* HEADER */}
                <div style={S.header}>
                  <div style={{ ...S.logo, flex: 1 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <div style={S.logoText}>CAR-FLIX</div>
                      <div style={S.logoSub}>UGANDA</div>
                      <div style={S.logoPartner}>In partnership with Emmy Investments</div>
                    </div>
                  </div>
                  <div style={S.headerIcons}>
                    <button style={S.iconBtn} onClick={() => user ? logout() : setShowAuth(true)}>
                      <Icon name={user ? "logout" : "user"} size={20} color={WHITE} />
                    </button>
                  </div>
                </div>

                {/* HOME TAB */}
                {tab === "home" && (
                  <>
                    {/* Search – WhatsApp style */}
                    <div style={S.searchZone}>
                      {/* Single clean pill — icon · input · filter icon */}
                      <div style={S.searchPill}>
                        <Icon name="search" size={17} color="#8696A0" />
                        <input
                          style={S.searchInput}
                          placeholder="Search cars…"
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                        {search.length > 0 && (
                          <button
                            onClick={() => setSearch("")}
                            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: MUTED }}
                          >
                            <Icon name="close" size={16} color="#8696A0" />
                          </button>
                        )}
                        <button style={S.searchFilterBtn} onClick={() => setShowFilter(true)}>
                          <Icon name="filter" size={14} color={WHITE} />
                          <span style={{ fontSize: 12, fontWeight: 800, fontFamily: "inherit" }}>Filter</span>
                        </button>
                      </div>

                      {/* Brand chips */}
                      <div style={S.filterRow}>
                        {BRANDS.map(b => (
                          <button key={b} style={S.filterChip(brandFilter === b)} onClick={() => { setBrandFilter(b); setFilters(f => ({ ...f, brand: b })); }}>
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── FEATURED CARS – Horizontal Scroll ── */}
                    {featuredCars.length > 0 && (
                      <div style={{ marginTop: 20, marginBottom: 4 }}>
                        {/* Section header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: 14 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 4, height: 22, background: GOLD, borderRadius: 3 }} />
                            <span style={{ fontWeight: 900, fontSize: 17, color: TEXT }}>Featured Cars</span>
                          </div>
                          <span style={{ fontSize: 11, color: GOLD, fontWeight: 800, background: "#FFFBEB", border: "1px solid #FDE68A", padding: "3px 10px", borderRadius: 20 }}>
                            HOT 🔥
                          </span>
                        </div>
                        {/* Horizontal scroll track */}
                        <div
                          style={{
                            display: "flex",
                            gap: 14,
                            overflowX: "auto",
                            padding: "4px 16px 16px",
                            scrollbarWidth: "none",
                            msOverflowStyle: "none",
                            WebkitOverflowScrolling: "touch",
                          }}
                        >
                        {loadingCars && cars.length === 0 ? (
                          <FeaturedSkeleton count={4} />
                        ) : (
                          featuredCars.map(car => (
                            <FeaturedCard key={car.id} car={car} />
                          ))
                        )}  
                        </div>
                        {/* Divider */}
                        <div style={{ height: 1, background: BORDER, margin: "0 16px" }} />
                      </div>
                    )}

                    {/* ── ALL LISTINGS ── */}
                    <div style={S.section}>
                      <div style={S.sectionRow}>
                        <span style={S.sectionTitle}>
                          {filtered.length} Car{filtered.length !== 1 ? "s" : ""} Available
                        </span>
                        <button style={S.browseAll} onClick={() => { setSearch(""); setBrandFilter("All"); setFilters({ brand: "All", condition: "Any Condition", location: "", minPrice: "", maxPrice: "" }); }}>
                          Browse all
                        </button>
                      </div>
                      {filtered.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "48px 0 32px", color: MUTED }}>
                          <Icon name="search" size={44} color="#E5E7EB" />
                          <p style={{ marginTop: 14, fontWeight: 600, fontSize: 15, color: "#9CA3AF" }}>No cars found</p>
                          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#C4C4C4" }}>Try a different search or filter</p>
                        </div>
                      ) : (
                        <div style={S.grid}>
                      {loadingCars && cars.length === 0 ? (     
                        <CarGridSkeleton count={8} />
                      ) : (
                        filtered.map(car => (
                          <CarCard key={car.id} car={car} />
                        ))
                      )}
                        </div>
                      )}
                      <div
                        ref={loaderRef}
                        style={{
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {loadingCars && (
                          <span style={{ color: "#666" }}>
                            Loading more cars...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* FAB — car icon + pill + pulse */}
                    <style>{`
                      @keyframes cfPulse {
                        0%   { box-shadow: 0 0 0 0 rgba(183,28,28,0.55), 0 6px 24px rgba(183,28,28,0.4); }
                        60%  { box-shadow: 0 0 0 14px rgba(183,28,28,0),  0 6px 24px rgba(183,28,28,0.4); }
                        100% { box-shadow: 0 0 0 0 rgba(183,28,28,0),     0 6px 24px rgba(183,28,28,0.4); }
                      }
                      @keyframes cfPulseGrey {
                        0%   { box-shadow: 0 0 0 0 rgba(156,163,175,0.5), 0 4px 16px rgba(0,0,0,0.15); }
                        60%  { box-shadow: 0 0 0 12px rgba(156,163,175,0), 0 4px 16px rgba(0,0,0,0.15); }
                        100% { box-shadow: 0 0 0 0 rgba(156,163,175,0),   0 4px 16px rgba(0,0,0,0.15); }
                      }
                      @keyframes cfFlyIn {
                        0%   { opacity: 0; transform: translateY(8px) scale(0.9); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                      }
                    `}</style>
                    {user ? (
                      <>
                        {showFabMenu && (
                          <div style={S.fabMenuBackdrop} onClick={() => setShowFabMenu(false)} />
                        )}
                        {showFabMenu && (
                          <div style={S.fabMenu}>
                            <button
                              style={{ ...S.fabMenuItem, animation: "cfFlyIn 0.16s ease-out 0.03s both" }}
                              onClick={() => { setShowFabMenu(false); setShowPost(true); }}
                            >
                              <span style={{ ...S.fabMenuIcon, background: RED }}>
                                <Icon name="car" size={18} color={WHITE} />
                              </span>
                              In Uganda
                            </button>
                            <button
                              style={{ ...S.fabMenuItem, animation: "cfFlyIn 0.16s ease-out both" }}
                              onClick={() => { setShowFabMenu(false); setShowPostImport(true); }}
                            >
                              <span style={{ ...S.fabMenuIcon, background: "#1D4ED8" }}>
                                <Icon name="shipping" size={18} color={WHITE} />
                              </span>
                              Importing
                            </button>
                          </div>
                        )}
                        <button
                          style={{ ...S.postFab, animation: showFabMenu ? "none" : "cfPulse 2.2s ease-out infinite" }}
                          onClick={() => setShowFabMenu((v) => !v)}
                          title="Post a car"
                        >
                          <Icon name={showFabMenu ? "close" : "car"} size={26} color={WHITE} />
                        </button>
                      </>
                    ) : (
                      <button
                        style={{ ...S.postFab, background: "#9CA3AF", animation: "cfPulseGrey 2.2s ease-out infinite" }}
                        onClick={() => setShowAuth(true)}
                        title="Sign in to post"
                      >
                        <Icon name="car" size={26} color={WHITE} />
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
                      <div style={{ textAlign: "center", padding: "52px 24px" }}>
                        <div style={{ width: 72, height: 72, background: "#FFF0F0", borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                          <Icon name="heart-outline" size={34} color={RED} />
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 16, color: TEXT, margin: "0 0 6px" }}>Sign in to see saved cars</p>
                        <p style={{ color: MUTED, fontSize: 13, margin: "0 0 20px" }}>Your saved listings will appear here</p>
                        <button style={{ ...S.primaryBtn, width: "auto", padding: "12px 32px", margin: "0 auto", display: "block" }} onClick={() => setShowAuth(true)}>Sign In</button>
                      </div>
                    ) : savedCars.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "52px 24px" }}>
                        <div style={{ width: 72, height: 72, background: "#F3F4F6", borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                          <Icon name="heart-outline" size={34} color="#D1D5DB" />
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 15, color: "#9CA3AF", margin: "0 0 6px" }}>No saved cars yet</p>
                        <p style={{ color: "#C4C4C4", fontSize: 13, margin: 0 }}>Tap the heart icon on any listing to save it</p>
                      </div>
                    ) : (
                      <div style={S.grid}>{savedCars.map(car => <CarCard key={car.id} car={car} />)}</div>
                    )}
                  </div>
                )}

                {/* MY CARS TAB */}
                {tab === "admin" && (
                  <div style={S.section}>
                    <div style={{ ...S.sectionRow, paddingTop: 4 }}>
                      <span style={S.sectionTitle}>My Listings</span>
                    </div>
                    {!user ? (
                      <div style={{ textAlign: "center", padding: "52px 24px" }}>
                        <div style={{ width: 72, height: 72, background: "#F3F4F6", borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                          <Icon name="lock" size={34} color="#D1D5DB" />
                        </div>
                        <p style={{ fontWeight: 700, fontSize: 16, color: TEXT, margin: "0 0 6px" }}>Sign in to manage listings</p>
                        <p style={{ color: MUTED, fontSize: 13, margin: "0 0 20px" }}>Post and manage your car listings</p>
                        <button style={{ ...S.primaryBtn, width: "auto", padding: "12px 32px", margin: "0 auto", display: "block" }} onClick={() => setShowAuth(true)}>Sign In</button>
                      </div>
                    ) : (
                      <>
                        {/* New: segmented toggle between My Cars and My Imports — reuses the existing filterChip style */}
                        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                          <button style={{ ...S.filterChip(manageTab === "cars"), flex: 1, textAlign: "center" }} onClick={() => setManageTab("cars")}>
                            My Cars
                          </button>
                          <button style={{ ...S.filterChip(manageTab === "imports"), flex: 1, textAlign: "center" }} onClick={() => setManageTab("imports")}>
                            My Imports
                          </button>
                        </div>

                        {manageTab === "cars" && (
                        <>
                        <button
                          style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }}
                          onClick={() => setShowPost(true)}
                        >
                          <Icon name="plus" size={18} color={WHITE} /> Post New Car
                        </button>
                        {myCars.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "32px 0", color: MUTED }}>
                            <Icon name="photo" size={40} color="#E5E7EB" />
                            <p style={{ marginTop: 12, fontWeight: 600 }}>You have no active listings.</p>
                          </div>
                        ) : myCars.map(car => (
                          <div key={car.id} style={{ background: CARD, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                            {car.images?.length > 0 && car.images[0] ? (
                              <img src={car.images[0]} alt="" style={{ width: 68, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 68, height: 56, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon name="photo" size={24} color="#D1D5DB" />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.carName}</p>
                              <p style={{ color: RED, fontWeight: 800, fontSize: 13, margin: "0 0 2px" }}>{formatPrice(car.price)}</p>
                              <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{car.location}</p>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button onClick={() => setEditCar(car)} style={{ background: "#EFF6FF", border: "none", borderRadius: 10, padding: 9, cursor: "pointer" }}>
                                <Icon name="edit" size={16} color="#1D4ED8" />
                              </button>
                              <button onClick={() => deleteCar(car.id)} style={{ background: "#FFF0F0", border: "none", borderRadius: 10, padding: 9, cursor: "pointer" }}>
                                <Icon name="delete" size={16} color={RED} />
                              </button>
                            </div>
                          </div>
                        ))}
                        </>
                        )}

                        {/* New: My Imports segment — same card layout/pattern as My Cars above, reading from `imports` instead of `cars` */}
                        {manageTab === "imports" && (
                        <>
                        <button
                          style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 18 }}
                          onClick={() => setShowPostImport(true)}
                        >
                          <Icon name="plus" size={18} color={WHITE} /> Post New Import
                        </button>
                        {myImports.length === 0 ? (
                          <div style={{ textAlign: "center", padding: "32px 0", color: MUTED }}>
                            <Icon name="shipping" size={40} color="#E5E7EB" />
                            <p style={{ marginTop: 12, fontWeight: 600 }}>You have no active imports.</p>
                          </div>
                        ) : myImports.map(car => (
                          <div key={car.id} style={{ background: CARD, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                            {car.images?.length > 0 && car.images[0] ? (
                              <img src={car.images[0]} alt="" style={{ width: 68, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                            ) : (
                              <div style={{ width: 68, height: 56, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                <Icon name="photo" size={24} color="#D1D5DB" />
                              </div>
                            )}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 2px", color: TEXT, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{car.carName}</p>
                              <p style={{ color: RED, fontWeight: 800, fontSize: 13, margin: "0 0 2px" }}>{formatPrice(car.price)}</p>
                              <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{car.originCountry} · {car.expectedArrival}</p>
                            </div>
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => alert("Editing imports isn't wired up yet — only delete is available for now.")}
                                style={{ background: "#EFF6FF", border: "none", borderRadius: 10, padding: 9, cursor: "pointer", opacity: 0.5 }}
                                title="Editing imports is coming soon"
                              >
                                <Icon name="edit" size={16} color="#1D4ED8" />
                              </button>
                              <button onClick={() => deleteImport(car.id)} style={{ background: "#FFF0F0", border: "none", borderRadius: 10, padding: 9, cursor: "pointer" }}>
                                <Icon name="delete" size={16} color={RED} />
                              </button>
                            </div>
                          </div>
                        ))}
                        </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ABOUT TAB */}
                {tab === "about" && (
                  <div style={{ padding: 16 }}>
                    {/* About card */}
                    <div style={{ background: CARD, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginTop: 0, marginBottom: 10 }}>About CAR-FLIX</h3>
                      <p style={{ color: MUTED, fontSize: 14, lineHeight: 1.75, margin: 0 }}>
                        CAR-FLIX is a third-party marketplace connecting car sellers with buyers across Africa. We are not responsible for negotiations, payments, or transaction outcomes between buyers and sellers.
                      </p>
                    </div>

                    {/* Contact card */}
                    <div style={{ background: CARD, borderRadius: 16, padding: 18, marginBottom: 12, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                      <h3 style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginTop: 0, marginBottom: 6 }}>Contact Us</h3>
                      <p style={{ color: MUTED, fontSize: 13, marginBottom: 14 }}>Reach our team on any of these WhatsApp lines:</p>
                      {WA_NUMBERS.map((wa, i) => {
                        const waColors = ["#16A34A", "#1D4ED8", "#EA580C"];
                        return (
                          <button key={i}
                            onClick={() => { const msg = "Hello, I'm requesting for help with the app"; window.location.href = `https://wa.me/${wa.number}?text=${encodeURIComponent(msg)}`; }}
                            style={{ ...S.primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10, background: waColors[i], borderRadius: 12 }}>
                            <Icon name="whatsapp" size={18} color={WHITE} /> {wa.label}: {wa.display}
                          </button>
                        );
                      })}
                    </div>

                    {/* Account card */}
                    {user && (
                      <div style={{ background: CARD, borderRadius: 16, padding: 18, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", border: `1px solid ${BORDER}` }}>
                        <h3 style={{ fontWeight: 800, fontSize: 16, color: TEXT, marginTop: 0, marginBottom: 10 }}>Account</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                          <div style={{ width: 44, height: 44, background: "#FFF0F0", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Icon name="user" size={22} color={RED} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, fontSize: 15, margin: "0 0 2px", color: TEXT }}>{user.username}</p>
                            <p style={{ color: MUTED, fontSize: 13, margin: 0 }}>{user.phone}</p>
                          </div>
                        </div>
                        <button style={{ ...S.ghostBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={logout}>
                          <Icon name="logout" size={18} color={RED} /> Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* IMPORTS TAB */}
                {tab === "imports" && (
                  <div style={S.section}>
                    <div style={S.sectionRow}>
                      <span style={S.sectionTitle}>
                        {filteredImports.length} Car{filteredImports.length !== 1 ? "s" : ""} Incoming
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                          style={{ background: showImportSearch ? "#FDE8E8" : "#F0F2F5", border: showImportSearch ? `1.5px solid ${RED}` : "1.5px solid #E5E7EB", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: showImportSearch ? "0 2px 8px rgba(183,28,28,0.18)" : "0 1px 4px rgba(0,0,0,0.08)" }}
                          onClick={() => setShowImportSearch(v => !v)}
                          title="Search imports"
                        >
                          <Icon name="search" size={20} color={showImportSearch ? RED : "#4B5563"} />
                        </button>
                        <span style={{ fontSize: 11, color: "#1D4ED8", fontWeight: 800, background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>
                          ✈️ ON THE WAY
                        </span>
                      </div>
                    </div>
                    <p style={{ color: MUTED, fontSize: 13, lineHeight: 1.6, marginBottom: showImportSearch ? 14 : 18, marginTop: -4 }}>
                      These cars are currently being imported and aren't in Uganda yet. Tap "Notify Me" to get a WhatsApp update when one lands.
                    </p>

                    {/* Collapsible search — same design language as Home */}
                    {showImportSearch && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ ...S.searchPill, marginBottom: 10 }}>
                          <Icon name="search" size={17} color="#8696A0" />
                          <input
                            style={S.searchInput}
                            placeholder="Search imports…"
                            value={importSearch}
                            onChange={e => setImportSearch(e.target.value)}
                            autoFocus
                          />
                          {importSearch.length > 0 && (
                            <button
                              onClick={() => setImportSearch("")}
                              style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", display: "flex", color: MUTED }}
                            >
                              <Icon name="close" size={16} color="#8696A0" />
                            </button>
                          )}
                        </div>
                        <div style={S.filterRow}>
                          {BRANDS.map(b => (
                            <button key={b} style={S.filterChip(importBrandFilter === b)} onClick={() => setImportBrandFilter(b)}>
                              {b}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredImports.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "48px 0 32px", color: MUTED }}>
                        <Icon name="shipping" size={44} color="#E5E7EB" />
                        {imports.length === 0 ? (
                          <>
                            <p style={{ marginTop: 14, fontWeight: 600, fontSize: 15, color: "#9CA3AF" }}>No imports right now</p>
                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#C4C4C4" }}>Check back soon for new arrivals</p>
                          </>
                        ) : (
                          <>
                            <p style={{ marginTop: 14, fontWeight: 600, fontSize: 15, color: "#9CA3AF" }}>No matches found</p>
                            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#C4C4C4" }}>Try a different search or brand</p>
                          </>
                        )}
                      </div>
                    ) : (
                      <>
                    {loadingImports && imports.length === 0 ? (
                      <ImportGridSkeleton count={6} />
                    ) : (
                      filteredImports.map(car => (
                        <ImportCard key={car.id} car={car} />
                      ))
                    )}
                      </>
                    )}
                  </div>
                )}

                {/* BOTTOM NAV */}
                <div style={S.bottomNav}>
                  {[
                    { id: "home", icon: "home", label: "Home" },
                    { id: "saved", icon: "heart", label: "Saved" },
                    { id: "admin", icon: "lock", label: "My Cars" },
                    { id: "imports", icon: "shipping", label: "Imports" },
                    { id: "about", icon: "info", label: "About" },
                  ].map(n => {
                    const active = tab === n.id;
                    return (
                      <button key={n.id} style={S.navItem(active)} onClick={() => setTab(n.id)}>
                        <Icon
                          name={active && n.id === "saved" ? "heart" : n.icon}
                          size={active ? 18 : 22}
                          color={active ? WHITE : "#9CA3AF"}
                        />
                        {active && n.label}
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
          }
        />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/admin"
          element={
            <AdminDashboard user={user} cars={cars} setCars={setCars} deleteCar={deleteCar} />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
