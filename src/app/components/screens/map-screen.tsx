import { useState } from "react";
import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Navigation,
  Layers,
  Plus,
  Minus,
  Crosshair,
  Phone,
  Volume2,
  Share2,
  X,
  Camera,
  Heart,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../state";
import { FloodMapCanvas } from "../flood-map-canvas";
import { getPins, type Pin } from "../data";
import { AlertBanner } from "../alert-banner";
import { EvacuateFAB } from "../evacuate-fab";
import { t } from "../i18n";

export function MapScreen() {
  const { state, setState, setEvacuating, isDesktop } = useApp();
  const [selected, setSelected] = useState<Pin | null>(null);
  const [showPredicted, setShowPredicted] = useState(true);
  const [mapZoom, setMapZoom] = useState(0.28);
  const [focusPan, setFocusPan] = useState({ x: 0, y: 0 });
  const [focusKey, setFocusKey] = useState(0);

  const focusMapOn = (target: { x: number; y: number }) => {
    const targetZoom = 0.6;
    setMapZoom(targetZoom);
    setFocusPan({
      x: (2400 - target.x) * targetZoom,
      y: (1200 - target.y) * targetZoom,
    });
    setFocusKey((k) => k + 1);
  };

  const isEmergency = state.mode === "emergency";
  const PINS = getPins(state.lang);

  React.useEffect(() => {
    if (state.selectedPin) {
      const pin = PINS.find((p) => p.id === state.selectedPin);
      if (pin) {
        setSelected(pin);
        setState((s) => ({ ...s, selectedPin: null }));
      }
    }
  }, [state.selectedPin]);

  return (
    <div className="relative flex flex-col" style={{ height: isDesktop ? "calc(100vh - 48px - 72px)" : "calc(100vh - 48px - 86px)" }}>
      
      <div className="relative z-20">
        <AlertBanner mode={state.mode} lang={state.lang} onRiskFocus={focusMapOn} />
      </div>

      
      <div className="relative flex-1" style={{ background: "#DCE4EA" }}>

        
        <div className="absolute inset-0">
          <FloodMapCanvas
            pins={PINS}
            onPinClick={(p) => setSelected(p)}
            showPredicted={showPredicted}
            zoom={mapZoom}
            onZoomChange={setMapZoom}
            showRoute={true}
            alternateRoute={false}
            lang={state.lang}
            initialPan={focusPan}
            resetViewKey={focusKey}
          />
        </div>

        
        <div className="absolute right-3 z-20 flex flex-col gap-2" style={{ top: 16 }}>
          {[
            { icon: Layers, on: showPredicted, onClick: () => setShowPredicted((s) => !s) },
            { icon: Plus, onClick: () => setMapZoom((z) => Math.min(z + 0.2, 3)) },
            { icon: Minus, onClick: () => setMapZoom((z) => Math.max(z - 0.2, 0.5)) },
            { icon: Crosshair, onClick: () => setMapZoom(1) },
          ].map((b, i) => {
            const Ic = b.icon;
            return (
              <button
                key={i}
                onClick={b.onClick}
                className="rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{
                  width: 48,
                  height: 48,
                  background: "white",
                  boxShadow: "0 2px 8px rgba(11,31,51,0.12)",
                  border: b.on ? "2px solid #1F7A3A" : "1px solid rgba(11,31,51,0.08)",
                }}
              >
                <Ic size={20} color={b.on ? "#1F7A3A" : "#0B1F33"} strokeWidth={b.on ? 2.5 : 2} />
              </button>
            );
          })}
        </div>

        
        {!selected && <EvacuateFAB onClick={() => setEvacuating(true)} />}

        
        <NearbySheet pins={PINS} onSelect={(p) => setSelected(p)} />
      </div>

      
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(11,31,51,0.4)" }}
            />
            <PinDetail
              pin={selected}
              onClose={() => setSelected(null)}
              onEvacuate={() => {
                setSelected(null);
                setEvacuating(true);
              }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NearbySheet({ pins, onSelect }: { pins: Pin[]; onSelect: (p: Pin) => void }) {
  const { state } = useApp();
  const [expanded, setExpanded] = useState(false);

  const getStatusKey = (oldStatus: string): "open" | "almostFull" | "closed" => {
    if (oldStatus === "OPEN") return "open";
    if (oldStatus === "FULL") return "closed";
    return "almostFull";
  };

  const getTypeKey = (type: string): "shelter" | "kitchen" | "medical" | "supply" | "transport" => {
    if (type === "shelter") return "shelter";
    if (type === "kitchen") return "kitchen";
    if (type === "medical") return "medical";
    if (type === "boat") return "transport";
    return "supply";
  };

  return (
    <motion.div
      initial={false}
      animate={{ height: expanded ? 196 : 48 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="absolute left-0 right-0 bottom-0 z-10 px-4 pt-1.5 pb-4 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(24px) saturate(160%)",
        boxShadow: "0 -4px 14px -8px rgba(11,31,51,0.08)",
        border: "1px solid rgba(255,255,255,0.5)",
        borderBottom: "none",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex flex-col items-center transition-all active:scale-98"
        style={{ background: "transparent" }}
        aria-label={t("toggleNearbySheet", state.lang)}
      >
        <div className="rounded-full mb-2" style={{ width: 28, height: 3, background: "rgba(11,31,51,0.12)" }} />
        <div className="w-full flex items-center justify-between gap-2" style={{ paddingLeft: 4, paddingRight: 4 }}>
          <div className="flex items-center gap-2 min-w-0">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0B1F33", letterSpacing: "0.02em" }}>
              {t("whatsNearYou", state.lang)}
            </span>
            <span
              className="rounded-full"
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "white",
                background: "#1F7A3A",
                padding: "1px 6px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {pins.length}
            </span>
          </div>
          <motion.span
            className="flex items-center gap-1 rounded-full"
            style={{
              padding: "3px 8px",
              background: expanded ? "rgba(11,31,51,0.05)" : "rgba(11,31,51,0.85)",
              color: expanded ? "#5A6B7A" : "white",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.02em",
            }}
            animate={expanded ? {} : { y: [0, -2, 0] }}
            transition={expanded ? {} : { duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            {expanded ? (
              <>
                <ChevronDown size={11} />
                {t("hideSheet", state.lang)}
              </>
            ) : (
              <>
                <ChevronUp size={11} />
                {t("tapToView", state.lang)}
              </>
            )}
          </motion.span>
        </div>
      </button>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 mt-3" style={{ scrollbarWidth: "none" }}>
        {pins.slice(0, 5).map((p) => {
          return (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="shrink-0 text-left rounded-2xl p-3 transition-all hover:shadow-md active:scale-98"
              style={{
                width: 200,
                background: "white",
                border: "1px solid rgba(11,31,51,0.08)",
                boxShadow: "0 2px 8px rgba(11,31,51,0.06)",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="rounded-full flex items-center justify-center shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: p.color,
                    color: "white",
                    fontSize: 16,
                  }}
                >
                  {p.emoji}
                </div>
                <div className="flex flex-col gap-1">
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: p.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {t(getTypeKey(p.type), state.lang)}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: p.status === "OPEN" ? "#1F7A3A" : p.status === "FULL" ? "#C8102E" : "#B8651F",
                    }}
                  >
                    {t(getStatusKey(p.status), state.lang)}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0B1F33", lineHeight: 1.25, marginBottom: 4 }}>
                {p.name}
              </div>
              <div style={{ fontSize: 12, color: "#5A6B7A", fontVariantNumeric: "tabular-nums" }}>
                {t("kmWalk", state.lang, p.distanceKm, p.walkMin)}
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function PinDetail({
  pin,
  onClose,
  onEvacuate,
}: {
  pin: Pin;
  onClose: () => void;
  onEvacuate: () => void;
}) {
  const { state, isDesktop } = useApp();
  const [playing, setPlaying] = useState(false);
  const [shared, setShared] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const getStatusKey = (oldStatus: string): "open" | "almostFull" | "closed" => {
    if (oldStatus === "OPEN") return "open";
    if (oldStatus === "FULL") return "closed";
    return "almostFull";
  };

  const getVoiceKey = () => {
    if (pin.type === "shelter") return "voiceSarah";
    if (pin.type === "kitchen") return "voiceLinh";
    if (pin.type === "medical") return "voicePatel";
    if (pin.type === "supply") return "voiceDavid";
    return "voiceAmira";
  };

  const getTypeKey = (): "shelter" | "kitchen" | "medical" | "supply" | "transport" => {
    if (pin.type === "shelter") return "shelter";
    if (pin.type === "kitchen") return "kitchen";
    if (pin.type === "medical") return "medical";
    if (pin.type === "boat") return "transport";
    return "supply";
  };

  return (
    <motion.div
      initial={isDesktop ? { opacity: 0, scale: 0.92, x: "-50%", y: "-50%" } : { y: "100%" }}
      animate={isDesktop ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" } : { y: 0 }}
      exit={isDesktop ? { opacity: 0, scale: 0.92, x: "-50%", y: "-50%" } : { y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 34 }}
      drag={isDesktop ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0, bottom: 0.4 }}
      onDragEnd={(_, info) => {
        if (!isDesktop && (info.offset.y > 120 || info.velocity.y > 600)) {
          onClose();
        }
      }}
      className="flex flex-col"
      style={
        isDesktop
          ? {
              position: "fixed",
              left: "50%",
              top: "50%",
              width: "min(540px, 90vw)",
              maxHeight: "85vh",
              borderRadius: 24,
              background: "white",
              boxShadow: "0 24px 48px rgba(11,31,51,0.25)",
              border: "1px solid rgba(11,31,51,0.08)",
              zIndex: 50,
              overflow: "hidden",
            }
          : {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              maxHeight: "85%",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              background: "white",
              boxShadow: "0 -16px 40px rgba(11,31,51,0.2)",
              border: "1px solid rgba(11,31,51,0.08)",
              borderBottom: "none",
              zIndex: 40,
              touchAction: "pan-y",
            }
      }
    >
      {!isDesktop && <div className="w-12 h-1.5 rounded-full mx-auto mt-3 mb-3 shrink-0" style={{ background: "rgba(11,31,51,0.15)" }} />}

      <div className="px-6 pt-2 pb-4 overflow-y-auto flex-1">
        
        <div className="flex items-start gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: pin.color, color: "white", fontSize: 28, boxShadow: `0 8px 16px -4px ${pin.color}40` }}
          >
            {pin.emoji}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 11, fontWeight: 700, color: pin.color, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>
              {t(getTypeKey(), state.lang)}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0B1F33", lineHeight: 1.2, marginBottom: 6 }}>
              {pin.name}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="px-2.5 py-1 rounded-full"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: pin.status === "OPEN" ? "#1F7A3A" : pin.status === "FULL" ? "#C8102E" : "#B8651F",
                  background: pin.status === "OPEN" ? "rgba(31,122,58,0.12)" : pin.status === "FULL" ? "rgba(200,16,46,0.12)" : "rgba(184,101,31,0.12)",
                }}
              >
                {t(getStatusKey(pin.status), state.lang)}
              </span>
              <span style={{ fontSize: 12, color: "#5A6B7A", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
                {t("kmWalk", state.lang, pin.distanceKm, pin.walkMin)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90"
            style={{ background: "rgba(11,31,51,0.06)" }}
          >
            <X size={16} color="#0B1F33" strokeWidth={2.5} />
          </button>
        </div>

        
        {pin.capacity && (
          <div className="mb-5 flex items-center justify-center">
            <div className="relative" style={{ width: 120, height: 120 }}>
              <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(11,31,51,0.08)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke={
                    pin.capacity.used / pin.capacity.total > 0.8
                      ? "#C8102E"
                      : pin.capacity.used / pin.capacity.total > 0.6
                      ? "#B8651F"
                      : "#1F7A3A"
                  }
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={327}
                  initial={{ strokeDashoffset: 327 }}
                  animate={{
                    strokeDashoffset: 327 - (327 * pin.capacity.used) / pin.capacity.total,
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div style={{ fontSize: 20, fontWeight: 700, color: "#0B1F33", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                  {pin.capacity.used}/{pin.capacity.total}
                </div>
                <div style={{ fontSize: 11, color: "#5A6B7A", marginTop: 4, fontWeight: 500, letterSpacing: "0.02em" }}>
                  {t("capacity", state.lang, pin.capacity.used, pin.capacity.total).split(" ").slice(-1)[0]}
                </div>
              </div>
            </div>
          </div>
        )}

        
        {pin.type === "kitchen" && (
          <div className="mb-5 rounded-2xl p-4 text-center" style={{ background: "rgba(224,123,44,0.08)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#E07B2C" }}>
              {t("dinnerIn", state.lang, 2, 14)}
            </div>
          </div>
        )}

        
        {pin.type === "medical" && (
          <div className="mb-5 rounded-2xl p-4 text-center" style={{ background: "rgba(200,16,46,0.08)" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#C8102E" }}>
              {t("waitTime", state.lang, 15)}
            </div>
          </div>
        )}

        
        <div className="mb-5 rounded-2xl p-4 flex gap-3 items-start" style={{ background: "rgba(156,39,176,0.08)", border: "1px solid rgba(156,39,176,0.15)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#9C27B0", color: "white" }}>
            <Heart size={16} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#7B1FA2" }}>{t("vulnerableCare", state.lang)}</div>
            <div style={{ fontSize: 12, color: "#6A1B9A", marginTop: 4, lineHeight: 1.4 }}>
              {t("vulnerableDesc", state.lang)}
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2 py-1 rounded-md" style={{ background: "rgba(156,39,176,0.1)", fontSize: 11, color: "#9C27B0", fontWeight: 600 }}>♿ {t("wheelchair", state.lang)}</span>
              <span className="px-2 py-1 rounded-md" style={{ background: "rgba(156,39,176,0.1)", fontSize: 11, color: "#9C27B0", fontWeight: 600 }}>🤰 {t("priorityLane", state.lang)}</span>
            </div>
          </div>
        </div>

        
        <button
          onClick={() => setPlaying((p) => !p)}
          className="w-full mb-6 flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-98"
          style={{
            background: playing ? "#1F7A3A" : "#F2F5F8",
            color: playing ? "white" : "#0B1F33",
            textAlign: "left",
          }}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ background: playing ? "rgba(255,255,255,0.2)" : "white", boxShadow: playing ? "none" : "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Volume2 size={20} color={playing ? "white" : "#1E88E5"} />
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 14, fontWeight: 700 }}>
              {playing ? t("playingUpdate", state.lang) : t("listenUpdate", state.lang)}
            </div>
            <div style={{ fontSize: 12, opacity: playing ? 0.9 : 0.6, marginTop: 2 }}>
              {t("voicedBy", state.lang)} {t(getVoiceKey(), state.lang)}
            </div>
          </div>
          {playing && (
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((i) => (
                <motion.span
                  key={i}
                  className="w-1 rounded-full bg-white"
                  animate={{ height: [6, 16, 6] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          )}
        </button>

        
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all active:scale-98"
            style={{
              fontSize: 13,
              color: shared ? "#1F7A3A" : "#0B1F33",
              background: shared ? "rgba(31,122,58,0.08)" : "rgba(11,31,51,0.04)",
              fontWeight: 500,
            }}
          >
            <Share2 size={16} />
            {shared ? t("shared", state.lang) : t("shareWithBuddy", state.lang)}
          </button>
        </div>

        
        <div className="mb-6 space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
          {pin.openingHours && (
            <div style={{ fontSize: 13, color: "#5A6B7A" }}>
              <span style={{ fontWeight: 600, color: "#0B1F33" }}>{t("hours", state.lang)}:</span> {pin.openingHours}
            </div>
          )}
          {pin.staff && (
            <div style={{ fontSize: 13, color: "#5A6B7A" }}>
              <span style={{ fontWeight: 600, color: "#0B1F33" }}>{t("staffLabel", state.lang)}:</span> {pin.staff}
            </div>
          )}
          {pin.services && pin.services.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {pin.services.slice(0, 5).map((service, i) => (
                <div
                  key={i}
                  className="px-2.5 py-1 rounded-full"
                  style={{
                    background: "rgba(11,31,51,0.06)",
                    fontSize: 12,
                    color: "#0B1F33",
                    fontWeight: 500,
                  }}
                >
                  {service}
                </div>
              ))}
            </div>
          )}
        </div>

        
        <div className="mb-6">
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.05em", color: "#5A6B7A", marginBottom: 12 }}>
            {t("stepByStep", state.lang)}
          </div>
          <div className="space-y-3">
            {(() => {
              const stepPrefix = pin.type === "shelter" ? "shelter" : pin.type === "kitchen" ? "kitchen" : pin.type === "medical" ? "medical" : "supply";
              return [1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex gap-3">
                  <div
                    className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center"
                    style={{
                      background: "#0B1F33",
                      color: "white",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {stepNum}
                  </div>
                  <div style={{ fontSize: 15, color: "#0B1F33", lineHeight: 1.5, paddingTop: 2 }}>
                    {t(`${stepPrefix}Step${stepNum}` as any, state.lang)}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>

        
        <button
          onClick={() => setReportOpen((o) => !o)}
          className="text-left transition-all active:opacity-60"
          style={{ fontSize: 13, color: "#5A6B7A", fontWeight: 500 }}
        >
          {t("reportWrong", state.lang)}
        </button>
      </div>

      
      <div
        className="px-5 pt-3 pb-4 shrink-0"
        style={{
          background: "white",
          borderTop: "1px solid rgba(11,31,51,0.06)",
        }}
      >
        <motion.button
          onClick={onEvacuate}
          whileTap={{ scale: 0.96, boxShadow: "0 2px 8px rgba(31,122,58,0.2)" }}
          className="w-full flex items-center justify-center gap-3 px-6 rounded-full transition-shadow"
          style={{
            height: 56,
            background: "#1F7A3A",
            color: "white",
            boxShadow: "0 8px 24px -6px rgba(31,122,58,0.4)",
          }}
        >
          <Navigation size={20} strokeWidth={2.5} />
          <span style={{ fontSize: 17, fontWeight: 600 }}>
            {t("takeMeThere", state.lang)}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}
