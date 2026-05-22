import { motion } from "motion/react";

export type POIType = "shelter" | "kitchen" | "medical" | "supply" | "transport";
export type POIStatus = "open" | "busy" | "full";

const POI_COLORS: Record<POIType, string> = {
  shelter: "#1F7A3A",
  kitchen: "#E07B2C",
  medical: "#C8102E",
  supply: "#2563EB",
  transport: "#6B46C1",
};

const STATUS_COLORS: Record<POIStatus, string> = {
  open: "#1F7A3A",
  busy: "#B8651F",
  full: "#C8102E",
};

const POI_ICONS: Record<POIType, React.ReactNode> = {
  shelter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  kitchen: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" />
      <path d="M19 2v20" />
    </svg>
  ),
  medical: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2v20M2 12h20" strokeLinecap="round" />
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  ),
  supply: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  transport: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 21l1-1m0 0l4.586-4.586a2 2 0 0 1 2.828 0L12 17m-5-5l1-1m0 0l4.586-4.586a2 2 0 0 1 2.828 0L17 8m-5-5l8 8" />
      <path d="M6 12h12v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6z" />
    </svg>
  ),
};

export function POIPin({
  type,
  status,
  capacity,
  onClick,
  size = "default",
}: {
  type: POIType;
  status: POIStatus;
  capacity?: number;
  onClick?: () => void;
  size?: "default" | "large";
}) {
  const baseSize = size === "large" ? 48 : 40;
  const iconSize = size === "large" ? 24 : 20;

  return (
    <motion.button
      onClick={onClick}
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      style={{
        width: baseSize,
        height: baseSize,
      }}
    >
      
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `3px solid ${STATUS_COLORS[status]}`,
          opacity: 0.8,
        }}
      />

      
      <div
        className="absolute inset-1 rounded-full flex items-center justify-center"
        style={{
          background: POI_COLORS[type],
          color: "white",
        }}
      >
        <div style={{ width: iconSize, height: iconSize }}>
          {POI_ICONS[type]}
        </div>
      </div>

      
      {capacity !== undefined && (
        <div
          className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
          style={{
            width: 20,
            height: 20,
            background: "white",
            border: "2px solid " + POI_COLORS[type],
            fontSize: 10,
            fontWeight: 700,
            color: POI_COLORS[type],
          }}
        >
          {capacity}%
        </div>
      )}

      
      <div
        className="absolute left-1/2 bottom-0 w-0 h-0"
        style={{
          transform: "translate(-50%, 50%)",
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: `8px solid ${POI_COLORS[type]}`,
        }}
      />
    </motion.button>
  );
}

export function POIIcon({
  type,
  size = 20,
}: {
  type: POIType;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: size * 1.8,
        height: size * 1.8,
        background: POI_COLORS[type],
        color: "white",
      }}
    >
      <div style={{ width: size, height: size }}>
        {POI_ICONS[type]}
      </div>
    </div>
  );
}
