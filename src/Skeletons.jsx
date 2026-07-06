// Skeletons.jsx
// Loading placeholders for CAR-FLIX Uganda. Dimensions are matched 1:1 to the
// real CarCard / FeaturedCard / ImportCard components in App.jsx so there is
// zero layout shift when real data swaps in.

const BORDER = "#E5E7EB";
const CARD = "#FFFFFF";

// ── Shimmer animation, injected once per exported component (not per row) ──
const ShimmerStyle = () => (
  <style>{`
    @keyframes cfSkeletonShimmer {
      0%   { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .cf-skel {
      background: linear-gradient(90deg, #ECEDEF 25%, #F6F7F8 37%, #ECEDEF 63%);
      background-size: 400% 100%;
      animation: cfSkeletonShimmer 1.4s ease-in-out infinite;
    }
  `}</style>
);

// ── Generic building blocks ────────────────────────────────────────────────
export const TextSkeleton = ({ width = "100%", height = 12, style = {} }) => (
  <div
    className="cf-skel"
    style={{ width, height, borderRadius: 6, ...style }}
  />
);

export const PillSkeleton = ({ width = 60, height = 22 }) => (
  <div
    className="cf-skel"
    style={{ width, height, borderRadius: 20, flexShrink: 0 }}
  />
);

export const ButtonSkeleton = ({ width = "100%", height = 34 }) => (
  <div
    className="cf-skel"
    style={{ width, height, borderRadius: 10 }}
  />
);

// ── Car grid card skeleton (matches S.card / CarCard, 2-col grid) ─────────
const CarCardSkeleton = () => (
  <div
    style={{
      background: CARD,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      border: `1px solid ${BORDER}`,
    }}
  >
    <div className="cf-skel" style={{ width: "100%", height: 128 }} />
    <div style={{ padding: "10px 12px 14px" }}>
      <TextSkeleton width="80%" height={13} style={{ marginBottom: 6 }} />
      <TextSkeleton width="55%" height={14} style={{ marginBottom: 8 }} />
      <TextSkeleton width="40%" height={11} style={{ marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 6 }}>
        <ButtonSkeleton height={28} />
        <ButtonSkeleton height={28} />
      </div>
    </div>
  </div>
);

export const CarGridSkeleton = ({ count = 8 }) => (
  <>
    <ShimmerStyle />
    {Array.from({ length: count }).map((_, i) => (
      <CarCardSkeleton key={i} />
    ))}
  </>
);

// ── Featured card skeleton (matches FeaturedCard, horizontal scroll) ──────
const FeaturedCardSkeleton = () => (
  <div
    style={{
      minWidth: 210,
      maxWidth: 210,
      background: CARD,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 4px 18px rgba(0,0,0,0.1)",
      border: `1px solid ${BORDER}`,
      flexShrink: 0,
    }}
  >
    <div className="cf-skel" style={{ width: "100%", height: 140 }} />
    <div style={{ padding: "12px 14px 14px" }}>
      <TextSkeleton width="85%" height={13} style={{ marginBottom: 6 }} />
      <TextSkeleton width="60%" height={15} style={{ marginBottom: 8 }} />
      <TextSkeleton width="45%" height={11} style={{ marginBottom: 12 }} />
      <ButtonSkeleton height={32} />
    </div>
  </div>
);

export const FeaturedSkeleton = ({ count = 4 }) => (
  <>
    <ShimmerStyle />
    {Array.from({ length: count }).map((_, i) => (
      <FeaturedCardSkeleton key={i} />
    ))}
  </>
);

// ── Import card skeleton (matches S.importCard, single-column list) ───────
const ImportCardSkeleton = () => (
  <div
    style={{
      background: CARD,
      borderRadius: 18,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
      border: `1px solid ${BORDER}`,
      marginBottom: 14,
    }}
  >
    <div className="cf-skel" style={{ width: "100%", height: 180 }} />
    <div style={{ padding: "12px 14px 16px" }}>
      <TextSkeleton width="70%" height={15} style={{ marginBottom: 6 }} />
      <TextSkeleton width="35%" height={12} style={{ marginBottom: 8 }} />
      <TextSkeleton width="45%" height={16} style={{ marginBottom: 10 }} />
      <div className="cf-skel" style={{ width: "100%", height: 30, borderRadius: 10, marginBottom: 10 }} />
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        <PillSkeleton width={70} />
      </div>
      <TextSkeleton width="100%" height={11} style={{ marginBottom: 5 }} />
      <TextSkeleton width="90%" height={11} style={{ marginBottom: 12 }} />
      <ButtonSkeleton height={38} />
    </div>
  </div>
);

export const ImportGridSkeleton = ({ count = 6 }) => (
  <>
    <ShimmerStyle />
    {Array.from({ length: count }).map((_, i) => (
      <ImportCardSkeleton key={i} />
    ))}
  </>
);

// ── Car detail modal skeleton (for a future async detail fetch) ───────────
export const CarDetailSkeleton = () => (
  <div style={{ padding: 16 }}>
    <ShimmerStyle />
    <div className="cf-skel" style={{ width: "100%", height: 260, borderRadius: 16, marginBottom: 16 }} />
    <TextSkeleton width="70%" height={20} style={{ marginBottom: 10 }} />
    <TextSkeleton width="40%" height={22} style={{ marginBottom: 14 }} />
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      <PillSkeleton width={80} />
      <PillSkeleton width={80} />
    </div>
    <TextSkeleton width="100%" height={12} style={{ marginBottom: 8 }} />
    <TextSkeleton width="100%" height={12} style={{ marginBottom: 8 }} />
    <TextSkeleton width="60%" height={12} style={{ marginBottom: 20 }} />
    <ButtonSkeleton height={46} />
  </div>
);