import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import type { Pin } from "./data";
import { t, type Language } from "./i18n";

export function FloodMapCanvas({
  pins,
  onPinClick,
  showPredicted = true,
  showRoute = false,
  zoom = 1,
  alternateRoute = false,
  lang = "en",
  onZoomChange,
  initialPan = { x: 0, y: 0 },
  resetViewKey,
}: {
  pins: Pin[];
  onPinClick?: (p: Pin) => void;
  showPredicted?: boolean;
  showRoute?: boolean;
  zoom?: number;
  alternateRoute?: boolean;
  lang?: Language;
  onZoomChange?: (z: number) => void;
  initialPan?: { x: number; y: number };
  resetViewKey?: number;
}) {
  const [pan, setPan] = useState(initialPan);
  const panRef = useRef(initialPan);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const lastTouchDistRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    panRef.current = initialPan;
    setPan(initialPan);
    applyTransform();
  }, [initialPan.x, initialPan.y, resetViewKey]);

  const MAP_WIDTH = 4800;
  const MAP_HEIGHT = 2400;

  const applyTransform = () => {
    const el = innerRef.current;
    if (!el) return;
    const { x, y } = panRef.current;
    el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${zoom})`;
  };

  useEffect(() => {
    applyTransform();
  }, [zoom]);

  const scheduleApply = () => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      applyTransform();
    });
  };

  const commitPan = () => {
    setPan(panRef.current);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panRef.current.x, y: e.clientY - panRef.current.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    panRef.current = { x: e.clientX - dragStartRef.current.x, y: e.clientY - dragStartRef.current.y };
    scheduleApply();
  };

  const handleMouseUp = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      commitPan();
    }
    lastTouchDistRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistRef.current = dist;
      isDraggingRef.current = false;
      setIsDragging(false);
    } else {
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = { x: e.touches[0].clientX - panRef.current.x, y: e.touches[0].clientY - panRef.current.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistRef.current !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - lastTouchDistRef.current;
      if (Math.abs(delta) > 5 && onZoomChange) {
        onZoomChange(Math.max(0.15, Math.min(3, zoom + delta * 0.005)));
        lastTouchDistRef.current = dist;
      }
    } else if (isDraggingRef.current && e.touches.length === 1) {
      panRef.current = { x: e.touches[0].clientX - dragStartRef.current.x, y: e.touches[0].clientY - dragStartRef.current.y };
      scheduleApply();
    }
  };

  const handleTouchEnd = () => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      commitPan();
    }
    lastTouchDistRef.current = null;
  };

  const wheelCommitTimer = useRef<number | null>(null);
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (onZoomChange) {
        onZoomChange(Math.max(0.15, Math.min(3, zoom - e.deltaY * 0.002)));
      }
    } else {
      panRef.current = { x: panRef.current.x - e.deltaX, y: panRef.current.y - e.deltaY };
      scheduleApply();
      if (wheelCommitTimer.current) window.clearTimeout(wheelCommitTimer.current);
      wheelCommitTimer.current = window.setTimeout(() => commitPan(), 120);
    }
  };

  useEffect(() => () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    if (wheelCommitTimer.current) window.clearTimeout(wheelCommitTimer.current);
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "#E8ECEF",
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
          transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${zoom})`,
          transformOrigin: "center center",
          willChange: "transform",
          transition: isDragging ? "none" : "transform 0.5s cubic-bezier(0.22,0.61,0.36,1)",
        }}
      >
        
        <svg width={MAP_WIDTH} height={MAP_HEIGHT} viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}>
          <defs>
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A3C6E4" />
              <stop offset="100%" stopColor="#81B2D9" />
            </linearGradient>
            
            <pattern id="floodWaterSevere" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#A8C9E4" fillOpacity="0.55" />
              <path d="M0 16 Q 8 12 16 16 T 32 16" fill="none" stroke="#7DA8C9" strokeWidth="1" strokeOpacity="0.25" />
            </pattern>
            <pattern id="floodWaterModerate" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#C2D8E9" fillOpacity="0.45" />
              <path d="M0 16 Q 8 13 16 16 T 32 16" fill="none" stroke="#9CB7CF" strokeWidth="0.8" strokeOpacity="0.22" />
            </pattern>
            <pattern id="floodWaterMinor" width="32" height="32" patternUnits="userSpaceOnUse">
              <rect width="32" height="32" fill="#D6E3EF" fillOpacity="0.4" />
              <path d="M0 16 Q 8 14 16 16 T 32 16" fill="none" stroke="#B5C6D5" strokeWidth="0.7" strokeOpacity="0.2" />
            </pattern>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.05" />
            </filter>
            <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0B1F33" floodOpacity="0.15" />
            </filter>
          </defs>

          
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#F1F3F4" />
          
          
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#E8EAED" strokeWidth="1" />
          </pattern>
          <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="url(#grid)" />

          
          <path d="M 800 300 L 1600 300 L 1600 900 L 800 900 Z" fill="#CEEAD6" rx="32" />
          <path d="M 3200 1500 L 4000 1500 L 4000 2100 L 3200 2100 Z" fill="#CEEAD6" rx="32" />

          
          <path
            d="M -100 1400 C 800 1300, 1600 1600, 2400 1440 S 4000 1300, 4900 1400 L 4900 1600 C 4000 1500, 3000 1700, 2200 1550 S 800 1500, -100 1600 Z"
            fill="#AADAFA"
          />

          
          
          <path 
            d="M -100 900 L 4900 900 M -100 1500 L 4900 1500 M 1800 -100 L 1800 2500 M 3000 -100 L 3000 2500" 
            stroke="#DADCE0" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round" fill="none" 
          />
          
          <path 
            d="M -100 600 L 4900 600 M -100 1200 L 4900 1200 M -100 1800 L 4900 1800 M 1200 -100 L 1200 2500 M 2400 -100 L 2400 2500 M 3600 -100 L 3600 2500" 
            stroke="#DADCE0" strokeWidth="30" strokeLinecap="round" strokeLinejoin="round" fill="none" 
          />

          
          
          <path 
            d="M -100 900 L 4900 900 M -100 1500 L 4900 1500 M 1800 -100 L 1800 2500 M 3000 -100 L 3000 2500" 
            stroke="#FFFFFF" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" 
          />
          
          <path 
            d="M -100 600 L 4900 600 M -100 1200 L 4900 1200 M -100 1800 L 4900 1800 M 1200 -100 L 1200 2500 M 2400 -100 L 2400 2500 M 3600 -100 L 3600 2500" 
            stroke="#FFFFFF" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" fill="none" 
          />

          
          {showPredicted && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              
              <path
                d="M 3180 1290 L 3260 1260 L 3380 1280 L 3520 1255 L 3680 1270 L 3820 1240 L 3960 1280 L 4080 1300 L 4180 1340 L 4240 1410 L 4280 1490 L 4310 1560 L 4280 1620 L 4220 1680 L 4140 1720 L 4040 1740 L 3920 1760 L 3800 1750 L 3680 1770 L 3560 1740 L 3460 1700 L 3360 1660 L 3280 1600 L 3220 1530 L 3180 1450 L 3160 1380 L 3170 1320 Z"
                fill="url(#floodWaterMinor)"
                stroke="#F4C430"
                strokeWidth="2"
                strokeOpacity="0.55"
                strokeDasharray="14 10"
              />
              
              <path
                d="M 1820 1500 L 1900 1470 L 2000 1450 L 2120 1440 L 2240 1455 L 2360 1450 L 2480 1470 L 2600 1490 L 2720 1530 L 2820 1580 L 2880 1660 L 2900 1740 L 2870 1810 L 2810 1870 L 2720 1910 L 2620 1930 L 2500 1940 L 2380 1930 L 2260 1900 L 2140 1870 L 2020 1820 L 1920 1760 L 1840 1690 L 1790 1620 L 1780 1560 Z"
                fill="url(#floodWaterModerate)"
                stroke="#E07B2C"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeDasharray="12 8"
              />
              
              <path
                d="M 520 1390 L 600 1360 L 700 1345 L 800 1340 L 900 1335 L 1000 1340 L 1100 1360 L 1180 1390 L 1240 1430 L 1280 1480 L 1310 1540 L 1340 1600 L 1360 1660 L 1340 1720 L 1300 1770 L 1240 1810 L 1170 1840 L 1090 1855 L 1000 1860 L 900 1855 L 810 1840 L 730 1820 L 660 1790 L 600 1750 L 550 1700 L 510 1640 L 480 1570 L 470 1500 L 480 1450 Z M 1180 1620 L 1280 1640 L 1380 1670 L 1460 1690 L 1500 1730 L 1480 1770 L 1420 1790 L 1340 1790 L 1260 1770 L 1200 1730 L 1180 1680 Z"
                fill="url(#floodWaterSevere)"
                fillRule="evenodd"
                stroke="#C8102E"
                strokeWidth="2.5"
                strokeOpacity="0.85"
              />
              
              <path
                d="M 2800 1590 L 2870 1565 L 2960 1555 L 3060 1550 L 3160 1555 L 3260 1570 L 3350 1595 L 3430 1630 L 3490 1675 L 3530 1730 L 3540 1790 L 3520 1845 L 3470 1890 L 3400 1925 L 3310 1950 L 3210 1965 L 3110 1965 L 3010 1955 L 2920 1935 L 2840 1900 L 2780 1855 L 2740 1800 L 2725 1740 L 2740 1685 L 2770 1630 Z"
                fill="url(#floodWaterSevere)"
                stroke="#C8102E"
                strokeWidth="2.5"
                strokeOpacity="0.85"
              />
            </motion.g>
          )}

          
          {showRoute && (
            <>
              
              <motion.path
                d="M 2400 1800 C 2800 1850, 3200 1750, 3600 1800 C 3550 1400, 3650 1000, 3600 600"
                stroke={alternateRoute ? "#264C8F" : "#80868B"}
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 2400 1800 C 2800 1850, 3200 1750, 3600 1800 C 3550 1400, 3650 1000, 3600 600"
                stroke={alternateRoute ? "#5A8DD6" : "#9AA0A6"}
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              
              <motion.path
                d="M 2400 1800 C 2300 1400, 2500 1000, 2400 600 C 2800 550, 3200 650, 3600 600"
                stroke={!alternateRoute ? "#264C8F" : "#80868B"}
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d="M 2400 1800 C 2300 1400, 2500 1000, 2400 600 C 2800 550, 3200 650, 3600 600"
                stroke={!alternateRoute ? "#5A8DD6" : "#9AA0A6"}
                strokeWidth="20"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              
              <motion.path
                d={alternateRoute 
                  ? "M 2400 1800 C 2800 1850, 3200 1750, 3600 1800 C 3550 1400, 3650 1000, 3600 600"
                  : "M 2400 1800 C 2300 1400, 2500 1000, 2400 600 C 2800 550, 3200 650, 3600 600"}
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="20 40"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.55, strokeDashoffset: [0, -120] }}
                transition={{ 
                  opacity: { delay: 1.5, duration: 0.5 },
                  strokeDashoffset: { repeat: Infinity, duration: 1, ease: "linear" }
                }}
              />
            </>
          )}
        </svg>

        
        <div
          className="absolute"
          style={{ 
            left: "50%", 
            top: "75%", 
            transform: `translate(-50%,-50%) scale(${1 / zoom})`,
            transformOrigin: "center center"
          }}
        >
          
          {showRoute && (
            <motion.div 
              className="absolute pointer-events-none" 
              style={{ left: -20, top: -40, width: 60, height: 60, transformOrigin: "30px 50px" }}
              animate={{ rotate: alternateRoute ? 90 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <svg viewBox="0 0 60 60" width="60" height="60">
                <defs>
                  <linearGradient id="coneGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#4285F4" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#4285F4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M 30 50 L 5 0 C 20 -5 40 -5 55 0 Z" fill="url(#coneGrad)" />
              </svg>
            </motion.div>
          )}

          
          <motion.div
            className="absolute left-[-16px] top-[-16px] w-[52px] h-[52px] rounded-full bg-[#4285F4]"
            animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          
          <div className="relative w-5 h-5 rounded-full border-[3px] border-white bg-[#4285F4]" style={{ boxShadow: "0 0 8px rgba(66,133,244,0.8)" }} />
        </div>

        
        {showPredicted && (
          <>
            {[
              { x: 920, y: 1620, level: "severe", color: "#C8102E", label: t("mapActiveFlooding", lang), sub: t("mapMaribyrnongLevel", lang) },
              { x: 3120, y: 1760, level: "severe", color: "#C8102E", label: t("mapActiveFlooding", lang), sub: t("mapFootscrayLevel", lang) },
              { x: 2380, y: 1700, level: "moderate", color: "#E07B2C", label: t("mapForecast1h", lang), sub: t("mapForecastLevel", lang) },
              { x: 3700, y: 1480, level: "minor", color: "#F4C430", label: t("mapPossibleSpread", lang), sub: t("mapSpreadLevel", lang) },
            ].map((m, i) => (
              <div
                key={`flood-${i}`}
                className="absolute pointer-events-none"
                style={{
                  left: m.x,
                  top: m.y,
                  transform: `translate(-50%,-50%) scale(${1 / zoom})`,
                  transformOrigin: "center center",
                }}
              >
                <div
                  className="rounded-md flex flex-col items-center"
                  style={{
                    background: "white",
                    border: `2px solid ${m.color}`,
                    boxShadow: "0 4px 10px rgba(11,31,51,0.18)",
                    padding: "3px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: 800, color: m.color, letterSpacing: "0.06em", lineHeight: 1.1 }}>
                    {m.label}
                  </span>
                  <span style={{ fontSize: 9, color: "#5A6B7A", fontWeight: 600, fontVariantNumeric: "tabular-nums", lineHeight: 1.2 }}>
                    {m.sub}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}

        
        {pins.map((p) => {
          const px = (p.x / 100) * MAP_WIDTH;
          const py = (p.y / 100) * MAP_HEIGHT;
          const ringProgress = p.capacity ? p.capacity.used / p.capacity.total : (p.status === "OPEN" ? 0 : 1);
          const ringColor = p.status === "OPEN" ? "#1F7A3A" : p.status === "FULL" ? "#C8102E" : "#B8651F";

          const dashOffset = 163.36 - 163.36 * (1 - ringProgress);
          return (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick?.(p);
              }}
              className="absolute flex flex-col items-center transition-transform active:scale-95"
              style={{
                left: px,
                top: py,
                transform: `translate(-50%, -100%) scale(${1 / zoom})`,
                transformOrigin: "50% 100%",
                pointerEvents: "auto",
                willChange: "transform",
              }}
            >
              
              <div className="relative flex items-center justify-center mb-1" style={{ width: 56, height: 56 }}>
                <svg className="absolute inset-0" width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="28" cy="28" r="26" fill="white" filter="url(#pinShadow)" />
                  <circle cx="28" cy="28" r="26" fill="none" stroke="rgba(11,31,51,0.06)" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="26" fill="none" stroke={ringColor} strokeWidth="4"
                    strokeLinecap="round" strokeDasharray={163.36}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
                  />
                </svg>
                <div
                  className="relative flex items-center justify-center rounded-full z-10"
                  style={{ width: 44, height: 44, background: p.color, color: "white", fontSize: 22 }}
                >
                  {p.emoji}
                </div>
              </div>

              
              <div
                className="px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 8px rgba(11,31,51,0.08)",
                  border: "1px solid rgba(255,255,255,0.6)",
                  whiteSpace: "nowrap",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0B1F33" }}>{p.name}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
