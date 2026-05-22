import { useState } from "react";
import { Phone, MapPin, Heart, ChevronRight, X, Volume2, Bell, VolumeX, Navigation, Globe } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../state";
import { t } from "../i18n";

export function MeScreen() {
  const { isDesktop, state, setTab, setState, showStartPage, restartFromStart } = useApp();
  const lang = state.lang;
  const [privacy, setPrivacy] = useState({
    location: true,
    address: true,
    buddy: true,
    photo: false,
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showDrills, setShowDrills] = useState(false);

  return (
    <div className="px-4 py-4 space-y-4" style={{ maxWidth: isDesktop ? 720 : "auto", margin: "0 auto" }}>
      
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
          boxShadow: "0 8px 24px -8px rgba(46,125,50,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="p-5 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
              🛡️
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 700, letterSpacing: "0.1em" }}>
              {t("myEvacuationPlan", lang)}
            </div>
          </div>

          <div className="mb-4">
            <div style={{ fontSize: 24, fontWeight: 600, color: "white", letterSpacing: "-0.02em" }}>
              {t("fcacPlanName", lang)}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)" }}>
                📍 {t("routeDistanceShort", lang)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { icon: "🆔", label: t("idMeds", lang) },
              { icon: "🔌", label: t("charger", lang) },
              { icon: "💧", label: t("water", lang) },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center py-2 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 2 }}>{item.icon}</div>
                <div style={{ fontSize: 11, color: "white", fontWeight: 600 }}>{item.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              setTab("map");
              setState((s) => ({ ...s, selectedPin: "fcac" }));
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-98 hover:shadow-lg"
            style={{
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Navigation size={16} />
            {t("viewRouteOnMap", lang)}
          </button>
        </div>

        
        <div
          className="px-5 py-4"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 700, letterSpacing: "0.08em", marginBottom: 10 }}>
            {t("stepByStep", lang)}
          </div>
          <div className="space-y-2">
            {[
              t("step1", lang),
              t("step2", lang),
              t("step3", lang),
              t("step4", lang),
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.25)",
                    color: "white",
                    fontSize: 11,
                    fontWeight: 700,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 13, color: "white", lineHeight: 1.4, flex: 1 }}>
                  {s}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="rounded-2xl p-4 flex items-center gap-3" style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #4FC3F7, #1E88E5)", color: "white", fontSize: 18, fontWeight: 600 }}
        >
          AL
        </div>
        <div className="flex-1">
          <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2545" }}>{t("profileName", lang)}</div>
          <div style={{ fontSize: 12, color: "#6E7C8A" }}>{t("profileAddress", lang)}</div>
        </div>
        <div
          className="px-2 py-1 rounded-full"
          style={{ background: "rgba(239,108,0,0.12)", fontSize: 10, fontWeight: 700, color: "#EF6C00" }}
        >
          {t("highRisk", lang)}
        </div>
      </div>

      
      <div className="rounded-2xl p-5" style={{
        background: "rgba(255,255,255,0.75)",
        backdropFilter: "blur(20px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.5)",
        boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
      }}>
        <div style={{ fontSize: 12, color: "#6E7C8A", fontWeight: 600, letterSpacing: "0.1em" }}>
          {t("myBuddy", lang)}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #F9A825, #EF6C00)", color: "white", fontSize: 20, fontWeight: 600 }}
          >
            MC
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 16, fontWeight: 600, color: "#0B2545" }}>{t("buddyAge", lang)}</div>
            <div style={{ fontSize: 12, color: "#6E7C8A", marginTop: 2 }}>
              0.2 {t("kmAway", lang)} · {t("needsHelp", lang)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => alert(t("safetyCheckSent", lang))}
            className="rounded-xl flex flex-col items-center justify-center gap-1.5 py-3 transition-all active:scale-95 hover:shadow-md"
            style={{
              background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
              color: "white",
              boxShadow: "0 4px 12px -4px rgba(46,125,50,0.3)",
            }}
          >
            <Heart size={16} strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{t("checkOn", lang)}</span>
          </button>
          <button
            onClick={() => window.location.href = "tel:+61412345678"}
            className="rounded-xl flex flex-col items-center justify-center gap-1.5 py-3 transition-all active:scale-95 hover:shadow-md"
            style={{
              background: "rgba(11,37,69,0.08)",
              backdropFilter: "blur(10px)",
              color: "#0B2545",
              border: "1px solid rgba(11,37,69,0.1)",
            }}
          >
            <Phone size={16} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{t("call", lang)}</span>
          </button>
          <button
            onClick={() => {
              setTab("map");
              setState((s) => ({ ...s, selectedPin: "mac" }));
            }}
            className="rounded-xl flex flex-col items-center justify-center gap-1.5 py-3 transition-all active:scale-95 hover:shadow-md"
            style={{
              background: "rgba(11,37,69,0.08)",
              backdropFilter: "blur(10px)",
              color: "#0B2545",
              border: "1px solid rgba(11,37,69,0.1)",
            }}
          >
            <MapPin size={16} strokeWidth={2} />
            <span style={{ fontSize: 12, fontWeight: 600 }}>{t("onMap", lang)}</span>
          </button>
        </div>
      </div>

      
      <button
        onClick={() => setShowDrills(!showDrills)}
        className="w-full rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-md active:scale-98"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(30,136,229,0.12)" }}>
            📅
          </div>
          <div className="text-left">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2545" }}>
              {t("communityDrills", lang)}
            </div>
            <div style={{ fontSize: 12, color: "#6E7C8A" }}>
              2 {t("of", lang)} 3 {t("attended", lang)}
            </div>
          </div>
        </div>
        <ChevronRight
          size={18}
          color="#6E7C8A"
          style={{
            transform: showDrills ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
        />
      </button>

      <AnimatePresence>
        {showDrills && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-4 mt-2" style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(11,37,69,0.08)",
            }}>
              <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(11,37,69,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: "66%", background: "#2E7D32" }} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontSize: 14, color: "#0B2545", fontWeight: 600 }}>{t("nextDrill", lang, t("drillDate", lang), "")}</div>
                  <div style={{ fontSize: 12, color: "#6E7C8A" }}>{t("drillLocationTime", lang)}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(t("rsvpConfirmed", lang));
                  }}
                  className="px-3 py-1.5 rounded-full transition-all active:scale-95"
                  style={{
                    background: "#1E88E5",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {t("rsvp", lang)}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <button
        onClick={() => setShowPrivacy(!showPrivacy)}
        className="w-full rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-md active:scale-98"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(30,136,229,0.12)" }}>
            🔒
          </div>
          <div className="text-left">
            <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2545" }}>
              {t("privacy", lang)}
            </div>
            <div style={{ fontSize: 12, color: "#6E7C8A" }}>
              {t("controlYourData", lang)}
            </div>
          </div>
        </div>
        <ChevronRight
          size={18}
          color="#6E7C8A"
          style={{
            transform: showPrivacy ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
        />
      </button>

      <AnimatePresence>
        {showPrivacy && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-4 mt-2 space-y-3" style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(11,37,69,0.08)",
            }}>
              {[
                { k: "location" as const, label: t("privacyLocation", lang) },
                { k: "buddy" as const, label: t("privacyBuddy", lang) },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between">
                  <span style={{ fontSize: 13, color: "#0B2545" }}>{row.label}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPrivacy((p) => ({ ...p, [row.k]: !p[row.k] }));
                    }}
                    className="relative rounded-full"
                    style={{
                      width: 44,
                      height: 26,
                      background: privacy[row.k] ? "#2E7D32" : "rgba(11,37,69,0.15)",
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      className="absolute top-0.5 rounded-full bg-white"
                      style={{
                        width: 22,
                        height: 22,
                        left: privacy[row.k] ? 20 : 2,
                        transition: "left 0.2s",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      
      <button
        onClick={() => showStartPage?.()}
        className="w-full flex items-center justify-between p-5 rounded-2xl transition-all active:scale-98 hover:shadow-md"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "rgba(30,136,229,0.12)" }}>
            <Globe size={20} color="#1E88E5" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#0B2545" }}>
            {t("changeLanguage", lang)}
          </span>
        </div>
        <ChevronRight size={18} color="#6E7C8A" strokeWidth={2} />
      </button>

      
      <button
        onClick={() => setShowSettings(true)}
        className="w-full flex items-center justify-between p-5 rounded-2xl transition-all active:scale-98 hover:shadow-md"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 4px 12px -6px rgba(11,37,69,0.08), inset 0 1px 0 rgba(255,255,255,0.7)",
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: "#0B2545" }}>
          {t("accessibilitySettings", lang)}
        </span>
        <ChevronRight size={18} color="#6E7C8A" strokeWidth={2} />
      </button>

      
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 z-50"
              style={{ background: "rgba(11,37,69,0.4)", backdropFilter: "blur(4px)" }}
            />
            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.92, x: "-50%", y: "-50%" } : { y: "100%" }}
              animate={isDesktop ? { opacity: 1, scale: 1, x: "-50%", y: "-50%" } : { y: 0 }}
              exit={isDesktop ? { opacity: 0, scale: 0.92, x: "-50%", y: "-50%" } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="fixed z-50 overflow-y-auto"
              style={
                isDesktop
                  ? {
                      left: "50%",
                      top: "50%",
                      width: "min(540px, 90vw)",
                      maxHeight: "85vh",
                      borderRadius: 24,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(40px) saturate(180%)",
                      boxShadow: "0 24px 48px -12px rgba(11,37,69,0.35), inset 0 1px 0 rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.6)",
                    }
                  : {
                      left: 0,
                      right: 0,
                      bottom: 0,
                      maxHeight: "90%",
                      borderTopLeftRadius: 24,
                      borderTopRightRadius: 24,
                      background: "rgba(255,255,255,0.95)",
                      backdropFilter: "blur(40px) saturate(180%)",
                      boxShadow: "0 -16px 40px -10px rgba(11,37,69,0.3), inset 0 1px 0 rgba(255,255,255,0.9)",
                      border: "1px solid rgba(255,255,255,0.6)",
                      borderBottom: "none",
                    }
              }
            >
              <div className="sticky top-0 z-10 px-5 pt-4 pb-3 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)", borderTopLeftRadius: 24, borderTopRightRadius: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, color: "#0B2545" }}>{t("accessibilitySettings", lang)}</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 hover:bg-gray-200"
                  style={{ background: "rgba(11,37,69,0.08)" }}
                >
                  <X size={16} color="#0B2545" strokeWidth={2.5} />
                </button>
              </div>

              <div className="px-5 pb-6 space-y-4">
                
                <SettingsItem
                  icon={<Volume2 size={20} color="#1E88E5" />}
                  title={t("alertSounds", lang)}
                  description={t("playSounds", lang)}
                  enabled={true}
                  onToggle={() => {}}
                />

                
                <SettingsItem
                  icon={<Bell size={20} color="#1E88E5" />}
                  title={t("vibration", lang)}
                  description={t("vibrateAlerts", lang)}
                  enabled={true}
                  onToggle={() => {}}
                />

                
                <SettingsItem
                  icon={<VolumeX size={20} color="#1E88E5" />}
                  title={t("silentMode", lang)}
                  description={t("disableAll", lang)}
                  enabled={false}
                  onToggle={() => {}}
                />

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="text-center pt-2 pb-2">
        <a
          href="tel:000"
          className="hover:underline"
          style={{ fontSize: 13, color: "#C62828", fontWeight: 600 }}
        >
          {t("emergency000", lang)}
        </a>
      </div>

      
      <div className="text-center pb-8">
        <button
          onClick={() => restartFromStart?.()}
          className="hover:underline transition-opacity active:opacity-60"
          style={{
            fontSize: 12,
            color: "#8E9CA8",
            fontWeight: 500,
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {t("restartFromStart", lang)}
        </button>
      </div>
    </div>
  );
}

function SettingsItem({
  icon,
  title,
  description,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleToggle = () => {
    setIsEnabled(!isEnabled);
    onToggle();
  };

  return (
    <div
      className="rounded-2xl p-4 flex items-start gap-4"
      style={{
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(11,37,69,0.08)",
      }}
    >
      <div className="shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1">
        <div style={{ fontSize: 15, fontWeight: 600, color: "#0B2545" }}>{title}</div>
        <div style={{ fontSize: 13, color: "#6E7C8A", marginTop: 2 }}>{description}</div>
      </div>
      <button
        onClick={handleToggle}
        className="relative rounded-full shrink-0"
        style={{
          width: 44,
          height: 26,
          background: isEnabled ? "#2E7D32" : "rgba(11,37,69,0.15)",
          transition: "background 0.2s",
        }}
      >
        <span
          className="absolute top-0.5 rounded-full bg-white"
          style={{
            width: 22,
            height: 22,
            left: isEnabled ? 20 : 2,
            transition: "left 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </button>
    </div>
  );
}
