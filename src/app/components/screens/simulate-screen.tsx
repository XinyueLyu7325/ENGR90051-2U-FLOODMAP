import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../state";
import { t } from "../i18n";
import { CloudRain, Waves, Clock, ChevronDown, ChevronUp } from "lucide-react";

type Scenario = "custom" | "now" | "6h" | "12h" | "24h";

export function SimulateScreen() {
  const { isDesktop, state } = useApp();
  const lang = state.lang;

  const [forMyAddr, setForMyAddr] = useState(true);
  const [scenario, setScenario] = useState<Scenario>("now");
  const [showControls, setShowControls] = useState(false);

  const [rainfall, setRainfall] = useState(20);
  const [duration, setDuration] = useState(2);
  const [riverFlow, setRiverFlow] = useState(35);
  const [timeOffset, setTimeOffset] = useState(0);

  const [level, setLevel] = useState(0.7);

  useEffect(() => {
    const rainfallFactor = rainfall / 100;
    const durationFactor = Math.min(duration / 12, 1);
    const flowFactor = riverFlow / 100;
    const timeFactor = Math.min(timeOffset / 24, 1);

    const calculatedLevel = (rainfallFactor * 0.8 + durationFactor * 0.5 + flowFactor * 1.0 + timeFactor * 0.4) * 0.9;
    setLevel(Math.min(calculatedLevel, 2.5));
  }, [rainfall, duration, riverFlow, timeOffset]);

  const applyScenario = (s: Scenario) => {
    setScenario(s);
    switch (s) {
      case "now":
        setTimeOffset(0);
        setRainfall(20);
        setDuration(2);
        setRiverFlow(35);
        break;
      case "6h":
        setTimeOffset(6);
        setRainfall(35);
        setDuration(4);
        setRiverFlow(50);
        break;
      case "12h":
        setTimeOffset(12);
        setRainfall(55);
        setDuration(7);
        setRiverFlow(65);
        break;
      case "24h":
        setTimeOffset(24);
        setRainfall(75);
        setDuration(10);
        setRiverFlow(80);
        break;
      default:
        break;
    }
  };

  const refs = [
    { v: 0.15, label: t("levelAnkle", lang) },
    { v: 0.3, label: t("levelKnee", lang) },
    { v: 0.6, label: t("levelWaist", lang) },
    { v: 0.9, label: t("levelCar", lang) },
    { v: 1.2, label: t("levelWindow", lang) },
    { v: 1.8, label: t("levelRoof", lang) },
  ];

  const closest = refs.reduce((a, b) => (Math.abs(b.v - level) < Math.abs(a.v - level) ? b : a));

  const getRainfallLabel = () => {
    if (rainfall < 25) return t("light", lang);
    if (rainfall < 50) return t("moderate", lang);
    if (rainfall < 75) return t("heavy", lang);
    return t("extreme", lang);
  };

  const getFlowLabel = () => {
    if (riverFlow < 33) return t("normal", lang);
    if (riverFlow < 66) return t("high", lang);
    return t("veryHigh", lang);
  };

  return (
    <div className="px-4 py-4 pb-8" style={{ maxWidth: isDesktop ? 720 : "auto", margin: "0 auto" }}>
      
      <div className="flex p-1 rounded-full mb-4" style={{ background: "rgba(11,37,69,0.06)" }}>
        {[
          { v: true, l: t("myAddress", lang) },
          { v: false, l: t("genericReference", lang) },
        ].map((x) => (
          <button
            key={x.l}
            onClick={() => setForMyAddr(x.v)}
            className="flex-1 rounded-full"
            style={{
              height: 36,
              fontSize: 13,
              fontWeight: 600,
              color: forMyAddr === x.v ? "#0B2545" : "#6E7C8A",
              background: forMyAddr === x.v ? "rgba(255,255,255,0.95)" : "transparent",
              boxShadow: forMyAddr === x.v ? "0 2px 8px rgba(11,37,69,0.1)" : "none",
              backdropFilter: forMyAddr === x.v ? "blur(10px)" : "none",
            }}
          >
            {x.l}
          </button>
        ))}
      </div>

      
      <div
        className="relative rounded-3xl overflow-hidden mb-4"
        style={{
          height: isDesktop ? 420 : 360,
          background: "linear-gradient(180deg, #B8D4E8 0%, #E5DCC8 100%)",
          boxShadow: "0 8px 24px -8px rgba(11,37,69,0.15)",
        }}
      >
        
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(30,136,229,0.85)" />
              <stop offset="100%" stopColor="rgba(11,37,69,0.95)" />
            </linearGradient>
            <linearGradient id="waterRipple" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>

          
          <rect x="0" y="340" width="400" height="60" fill="#B8A07A" />

          
          <rect x="240" y="100" width="160" height="240" fill="#F2E8D5" />
          <polygon points="220,100 320,40 420,100" fill="#8B5A3C" />
          
          
          <rect x="260" y="260" width="40" height="80" fill="#5C3A26" />
          <rect x="320" y="240" width="60" height="40" fill="#9BC4E2" />
          
          
          <rect x="260" y="140" width="40" height="50" fill="#9BC4E2" />
          <rect x="320" y="140" width="60" height="50" fill="#9BC4E2" />
          
          
          <line x1="240" y1="220" x2="400" y2="220" stroke="#8B7355" strokeWidth="2" />

          
          <g>
            <rect x="20" y="295" width="160" height="30" rx="8" fill="#C62828" />
            <path d="M 50 295 L 70 265 L 130 265 L 160 295 Z" fill="#C62828" />
            <path d="M 55 290 L 73 270 L 100 270 L 100 290 Z" fill="#9BC4E2" />
            <path d="M 105 290 L 105 270 L 127 270 L 150 290 Z" fill="#9BC4E2" />
            <circle cx="50" cy="325" r="15" fill="#1A1A1A" />
            <circle cx="50" cy="325" r="8" fill="#D9D9D9" />
            <circle cx="150" cy="325" r="15" fill="#1A1A1A" />
            <circle cx="150" cy="325" r="8" fill="#D9D9D9" />
          </g>

          
          <g>
            <circle cx="210" cy="280" r="8" fill="#0B2545" />
            <rect x="202" y="288" width="16" height="25" rx="4" fill="#0B2545" />
            <rect x="204" y="310" width="5" height="30" fill="#0B2545" />
            <rect x="211" y="310" width="5" height="30" fill="#0B2545" />
            <rect x="198" y="290" width="4" height="20" rx="2" fill="#0B2545" />
            <rect x="218" y="290" width="4" height="20" rx="2" fill="#0B2545" />
          </g>

          
          <g opacity="0.4">
            <line x1="0" y1="340" x2="400" y2="340" stroke="#6E7C8A" strokeWidth="1" strokeDasharray="2,4" />
            <text x="8" y="335" fontSize="10" fill="#6E7C8A" fontWeight="600">0m</text>
            
            <line x1="0" y1="300" x2="400" y2="300" stroke="#6E7C8A" strokeWidth="1" strokeDasharray="2,4" />
            <text x="8" y="295" fontSize="10" fill="#6E7C8A" fontWeight="600">1m</text>

            <line x1="0" y1="260" x2="400" y2="260" stroke="#6E7C8A" strokeWidth="1" strokeDasharray="2,4" />
            <text x="8" y="255" fontSize="10" fill="#6E7C8A" fontWeight="600">2m</text>

            <line x1="0" y1="220" x2="400" y2="220" stroke="#6E7C8A" strokeWidth="1" strokeDasharray="2,4" />
            <text x="8" y="215" fontSize="10" fill="#6E7C8A" fontWeight="600">3m</text>

            <line x1="0" y1="180" x2="400" y2="180" stroke="#6E7C8A" strokeWidth="1" strokeDasharray="2,4" />
            <text x="8" y="175" fontSize="10" fill="#6E7C8A" fontWeight="600">4m</text>
          </g>

          
          <motion.rect
            x="0"
            y={340 - level * 40}
            width="400"
            height={level * 40 + 60}
            fill="url(#waterGrad)"
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
          
          <motion.line
            x1="0"
            y1={340 - level * 40}
            x2="400"
            y2={340 - level * 40}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="2"
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
          />
          
          <motion.rect
            x="-400"
            y={340 - level * 40}
            width="800"
            height="4"
            fill="url(#waterRipple)"
            animate={{ x: [0, -400] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        
        <div
          className="absolute top-4 left-4 px-4 py-3 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 8px 24px -8px rgba(11,37,69,0.2), inset 0 1px 0 rgba(255,255,255,0.6)",
            border: "1px solid rgba(255,255,255,0.4)",
          }}
        >
          <div style={{ fontSize: 10, color: "#6E7C8A", fontWeight: 700, letterSpacing: "0.1em" }}>
            {t("waterLevel", lang)}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: "#0B2545", fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", marginTop: 2 }}>
            {level.toFixed(1)} m
          </div>
        </div>

        
        {scenario !== "custom" && (
          <div
            className="absolute top-4 right-4 px-3 py-2 rounded-full"
            style={{
              background: "rgba(30,136,229,0.9)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 4px 12px -4px rgba(30,136,229,0.4)",
              fontSize: 11,
              fontWeight: 700,
              color: "white",
              letterSpacing: "0.08em",
            }}
          >
            {scenario === "now" ? t("now", lang) : `+${timeOffset}H`}
          </div>
        )}
      </div>

      
      <div
        className="mb-4 rounded-2xl p-4"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 8px 24px -8px rgba(11,37,69,0.12)",
        }}
      >
        <div style={{ fontSize: 12, color: "#6E7C8A", fontWeight: 700, letterSpacing: "0.08em" }}>
          {forMyAddr ? t("predictedImpact", lang) : t("atThisLevel", lang)}
        </div>
        <div style={{ fontSize: 17, color: "#0B2545", fontWeight: 600, marginTop: 6, lineHeight: 1.4 }}>
          {closest.label}
        </div>
        {forMyAddr && (
          <div style={{ fontSize: 14, color: "#44525F", marginTop: 8, lineHeight: 1.4 }}>
          <span style={{ color: level > 1.5 ? "#C62828" : level > 0.5 ? "#EF6C00" : "#2E7D32", fontWeight: 600 }}>
            {level > 1.5 ? t("adviseImmediate", lang) : level > 0.5 ? t("adviseStrong", lang) : t("adviseMonitor", lang)}
          </span>
          </div>
        )}
      </div>

      
      <div className="mb-4">
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#6E7C8A", marginBottom: 10 }}>
          {t("timeProjection", lang)}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "now" as const, label: t("now", lang), time: "+0h" },
            { id: "6h" as const, label: t("plus6h", lang), time: "+6h" },
            { id: "12h" as const, label: t("plus12h", lang), time: "+12h" },
            { id: "24h" as const, label: t("plus24h", lang), time: "+24h" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => applyScenario(s.id)}
              className="rounded-xl py-3 px-2 flex flex-col items-center gap-1 transition-all hover:shadow-md active:scale-95"
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: scenario === s.id ? "white" : "#0B2545",
                background: scenario === s.id ? "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)" : "rgba(255,255,255,0.6)",
                backdropFilter: scenario === s.id ? "none" : "blur(10px)",
                border: scenario === s.id ? "none" : "1px solid rgba(11,37,69,0.08)",
                boxShadow: scenario === s.id ? "0 4px 12px -4px rgba(30,136,229,0.4)" : "none",
              }}
            >
              <span style={{ fontSize: 10, opacity: 0.8, fontWeight: 700, letterSpacing: "0.05em" }}>{s.time}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      
      <button
        onClick={() => setShowControls(!showControls)}
        className="w-full flex items-center justify-between p-4 rounded-2xl mb-3"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(11,37,69,0.08)",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#0B2545" }}>
          {showControls ? t("hideControls", lang) : t("showControls", lang)}
        </span>
        {showControls ? <ChevronUp size={18} color="#0B2545" /> : <ChevronDown size={18} color="#0B2545" />}
      </button>

      
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 mb-4">
              
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CloudRain size={16} color="#1E88E5" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                      {t("rainfallIntensity", lang)}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1E88E5" }}>
                    {getRainfallLabel()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={rainfall}
                  onChange={(e) => {
                    setRainfall(parseInt(e.target.value));
                    setScenario("custom");
                  }}
                  className="w-full"
                  style={{ accentColor: "#1E88E5" }}
                />
              </div>

              
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="#1E88E5" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                      {t("rainfallDuration", lang)}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1E88E5" }}>
                    {duration} {t("durationHours", lang)}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={duration}
                  onChange={(e) => {
                    setDuration(parseInt(e.target.value));
                    setScenario("custom");
                  }}
                  className="w-full"
                  style={{ accentColor: "#1E88E5" }}
                />
              </div>

              
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Waves size={16} color="#1E88E5" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                      {t("riverFlow", lang)}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1E88E5" }}>
                    {getFlowLabel()}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={riverFlow}
                  onChange={(e) => {
                    setRiverFlow(parseInt(e.target.value));
                    setScenario("custom");
                  }}
                  className="w-full"
                  style={{ accentColor: "#1E88E5" }}
                />
              </div>

              
              <div
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock size={16} color="#1E88E5" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                      {t("timeProjection", lang)}
                    </span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1E88E5" }}>
                    {timeOffset === 0 ? t("now", lang) : `+${timeOffset}h`}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={48}
                  value={timeOffset}
                  onChange={(e) => {
                    setTimeOffset(parseInt(e.target.value));
                    setScenario("custom");
                  }}
                  className="w-full"
                  style={{ accentColor: "#1E88E5" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
