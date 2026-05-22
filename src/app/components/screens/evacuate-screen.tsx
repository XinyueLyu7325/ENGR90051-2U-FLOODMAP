import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useApp } from "../state";
import { t } from "../i18n";
import { FloodMapCanvas } from "../flood-map-canvas";
import { getPins } from "../data";

export function EvacuateScreen() {
  const { setEvacuating, isDesktop, setState, setTab, state } = useApp();
  const lang = state.lang;
  const PINS = getPins(lang);
  const [arrived, setArrived] = useState(false);
  const [showAlternateRoute, setShowAlternateRoute] = useState(false);
  const [mapZoom, setMapZoom] = useState(0.38);

  if (arrived) {
    return (
      <div className="px-5 py-10 flex flex-col items-center text-center" style={{ minHeight: "70vh", maxWidth: 480, margin: "0 auto" }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(46,125,50,0.12)" }}
        >
          <CheckCircle2 size={48} color="#2E7D32" strokeWidth={2.2} />
        </motion.div>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: "#0B2545", letterSpacing: "-0.02em" }}>
          {t("youreSafe", lang)}
        </h1>
        <p style={{ fontSize: 16, color: "#44525F", marginTop: 12, lineHeight: 1.5 }}>
          {t("buddyNotified", lang)}
        </p>

        <div className="mt-6 w-full rounded-2xl p-4 text-left" style={{
          background: "rgba(255,255,255,0.8)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}>
          <div style={{ fontSize: 12, color: "#6E7C8A", fontWeight: 600, letterSpacing: "0.1em" }}>
            {t("buddyNotifiedLabel", lang)}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #F9A825, #EF6C00)", color: "white", fontWeight: 600 }}>
              MC
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2545" }}>{t("buddyMaria", lang)}</div>
              <div style={{ fontSize: 12, color: "#6E7C8A" }}>{t("buddyDeliveryStatus", lang)}</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setArrived(false);
            setEvacuating(false);
            setState((s) => ({ ...s, arrivedSafe: true, selectedPin: "fcac" }));
            setTab("map");
          }}
          className="mt-8 w-full rounded-2xl transition-all active:scale-95 hover:shadow-xl"
          style={{
            height: 56,
            background: "linear-gradient(135deg, #0B2545 0%, #1E3A5F 100%)",
            color: "white",
            fontSize: 16,
            fontWeight: 600,
            boxShadow: "0 8px 20px -6px rgba(11,37,69,0.4)",
          }}
        >
          {t("viewShelterDetails", lang)}
        </button>
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: isDesktop ? "calc(100vh - 68px)" : "calc(100vh - 60px)" }}>
      <div className="absolute inset-0">
        <FloodMapCanvas
          pins={PINS.filter((p) => p.id === "fcac" || p.id === "active")}
          showRoute
          showPredicted={false}
          alternateRoute={showAlternateRoute}
          zoom={mapZoom}
          lang={lang}
          onZoomChange={setMapZoom}
        />
      </div>

      
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col gap-2">
        <div 
          className="w-full rounded-[24px] shadow-lg p-3 text-white flex items-center gap-3 transition-all"
          style={{ background: "#0F9D58" }}
        >
          <button
            onClick={() => setEvacuating(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-90 bg-white/20 hover:bg-white/30"
          >
            <ArrowLeft size={20} color="white" strokeWidth={2.5} />
          </button>
          <div className="flex flex-col items-center justify-center w-8">
            <svg viewBox="0 0 24 24" width="28" height="28" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M 12 20 L 12 8 M 12 8 L 6 14 M 12 8 L 18 14" />
            </svg>
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>{t("navDistance300", lang)}</div>
            <div style={{ fontSize: 14, fontWeight: 600, opacity: 0.95, marginTop: 2 }}>{t("navHeadNorth", lang)}</div>
          </div>
        </div>
      </div>

      
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute z-20 left-3 right-3 rounded-2xl px-4 py-3 flex items-center gap-3"
        style={{
          top: 84,
          background: "rgba(249,168,37,0.95)",
          backdropFilter: "blur(10px)",
          color: "#0B2545",
          boxShadow: "0 8px 20px -8px rgba(11,37,69,0.2)",
        }}
      >
        <AlertTriangle size={18} />
        <div className="flex-1">
          <div style={{ fontSize: 14, fontWeight: 600 }}>{t("sirensActive", lang)}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>{t("cautionWater", lang)}</div>
        </div>
      </motion.div>

      
      <AnimatePresence>
        {!showAlternateRoute && (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => setShowAlternateRoute(true)}
            whileTap={{ scale: 0.96, boxShadow: "0 4px 12px -4px rgba(11,37,69,0.15)" }}
            className="absolute z-20 left-3 right-3 rounded-2xl px-4 py-3 flex items-center gap-3 transition-all hover:shadow-xl cursor-pointer"
            style={{
              bottom: 104,
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.5)",
              boxShadow: "0 8px 20px -8px rgba(11,37,69,0.2), inset 0 1px 0 rgba(255,255,255,0.8)",
            }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(30,136,229,0.12)" }}>
              🚤
            </div>
            <div className="flex-1 text-left">
              <div style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                {t("deepWaterWarning", lang)}
              </div>
              <div style={{ fontSize: 12, color: "#1E88E5", fontWeight: 500, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                {t("boatName", lang)}{t("hubDistTap", lang)}
                <span style={{ fontWeight: 700, textDecoration: "underline" }}>{t("tapToRedirect", lang)}</span>
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {showAlternateRoute && (
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="absolute z-20 left-3 right-3 rounded-2xl px-4 py-3"
            style={{
              bottom: 104,
              background: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 8px 20px -8px rgba(30,136,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
              color: "white",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.2)" }}>
                ✓
              </div>
              <div className="flex-1">
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {t("routeUpdated", lang)}
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>
                  {t("routeUpdatedDesc", lang)}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <div className="absolute z-30 left-3 right-3" style={{ bottom: 24 }}>
        <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-3 flex items-center justify-between border border-gray-100">
          <div className="flex flex-col px-2">
            <div style={{ fontSize: 24, fontWeight: 800, color: "#1F7A3A", lineHeight: 1 }}>
              {showAlternateRoute ? t("etaAlternate", lang) : t("etaNormal", lang)}
            </div>
            <div style={{ fontSize: 13, color: "#5A6B7A", marginTop: 4, fontWeight: 500 }}>
              {showAlternateRoute ? t("arrivalAlternate", lang) : t("arrivalNormal", lang)}
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-[#F2F5F8] text-[#0B1F33] px-4 py-3 rounded-xl font-bold text-[14px] active:scale-95 transition-transform"
              onClick={() => setEvacuating(false)}
            >
              {t("exit", lang)}
            </button>
            <motion.button
              onClick={() => setArrived(true)}
              whileTap={{ scale: 0.98 }}
              className="px-5 py-3 rounded-xl flex items-center justify-center transition-all shadow-md"
              style={{
                background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
                color: "white",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              {t("arrivedSafely", lang)}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
