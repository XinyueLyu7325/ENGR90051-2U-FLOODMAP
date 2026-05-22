import { Map, Bell, Droplet, User } from "lucide-react";
import { useApp, type Lang } from "./state";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { t } from "./i18n";

export function TopBar() {
  const { state, setState, isDesktop } = useApp();
  const [dataInfoOpen, setDataInfoOpen] = useState(false);

  const isOnline = true;

  const cycleTextSize = () => {
    const sizes: Array<"small" | "medium" | "large"> = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(state.textSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setState((s) => ({ ...s, textSize: sizes[nextIndex] }));
  };

  return (
    <>
      {dataInfoOpen && (
        <div
          onClick={() => {
            setDataInfoOpen(false);
          }}
          className="fixed inset-0 z-30"
          style={{ background: "transparent" }}
        />
      )}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-4"
        style={{
          height: 48,
          background: "#EEF2F5",
          borderBottom: "1px solid rgba(11,31,51,0.08)",
        }}
      >
        
        <div className="flex items-center gap-2">
          <div
            className="rounded flex items-center justify-center"
            style={{ width: 24, height: 24, background: "#1F7A3A" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 13l9-9 9 9v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8z"
                fill="white"
              />
            </svg>
          </div>
          <div className="leading-tight">
            <div
              style={{
                fontSize: 8,
                color: "#5A6B7A",
                letterSpacing: "0.08em",
                fontWeight: 600,
              }}
            >
              {t("topTag", state.lang)}
            </div>
            <div style={{ fontSize: 12, color: "#0B1F33", fontWeight: 700 }}>
              {t("appSubtitle", state.lang)}
            </div>
          </div>
        </div>

        
        <div className="flex items-center gap-3">
          
          <div className="relative">
            <button
              onClick={() => setDataInfoOpen((o) => !o)}
              className="flex items-center justify-center active-scale touch-none-select"
              style={{ width: 24, height: 24 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: isOnline ? "#1F7A3A" : "#B8651F",
                  boxShadow: isOnline
                    ? "0 0 0 2px rgba(31,122,58,0.2)"
                    : "0 0 0 2px rgba(184,101,31,0.2)",
                }}
              />
            </button>
            <AnimatePresence>
              {dataInfoOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="absolute right-0 top-8 z-50 rounded-lg px-3 py-2"
                  style={{
                    background: "white",
                    minWidth: 140,
                    boxShadow: "0 4px 16px rgba(11,31,51,0.15)",
                    border: "1px solid rgba(11,31,51,0.1)",
                  }}
                >
                  <div style={{ fontSize: 12, color: "#0B1F33", fontWeight: 500 }}>
                    {isOnline ? t("liveData", state.lang as any) : t("offlineMode", state.lang as any)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          
          <button
            onClick={cycleTextSize}
            className="flex items-center justify-center gap-1 active-scale touch-none-select"
            title={t("textSize", state.lang as any)}
            aria-label={t("textSize", state.lang as any)}
            style={{
              minWidth: 52,
              height: 30,
              padding: "0 9px",
              borderRadius: 999,
              background: state.textSize === "large" ? "#0B1F33" : "white",
              border: "1px solid rgba(11,31,51,0.16)",
              boxShadow: "0 2px 8px rgba(11,31,51,0.12)",
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: state.textSize === "large" ? "white" : "#0B1F33",
                lineHeight: 1,
              }}
            >
              A+
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: state.textSize === "large" ? "rgba(255,255,255,0.82)" : "#5A6B7A",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {state.textSize === "small" ? "S" : state.textSize === "medium" ? "M" : "L"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export function TabBar() {
  const { tab, setTab, isDesktop, state } = useApp();
  const items = [
    { id: "map" as const, labelKey: "tabMap" as const, icon: Map },
    { id: "alerts" as const, labelKey: "tabAlerts" as const, icon: Bell },
    { id: "simulate" as const, labelKey: "tabSimulate" as const, icon: Droplet },
    { id: "me" as const, labelKey: "tabMe" as const, icon: User },
  ];

  const hasActiveAlert = state.mode === "emergency" || state.mode === "watch";

  return (
    <div
      className="sticky bottom-0 z-40 grid grid-cols-4"
      style={{
        background: "#EEF2F5",
        borderTop: "1px solid rgba(11,31,51,0.08)",
        paddingBottom: isDesktop ? 8 : 22,
        paddingTop: 8,
      }}
    >
      {items.map((it) => {
        const active = tab === it.id;
        const Icon = it.icon;
        const showDot = it.id === "alerts" && hasActiveAlert;

        return (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="flex flex-col items-center justify-center gap-1 relative active-scale touch-none-select"
            style={{ height: 56 }}
          >
            {active && (
              <div
                className="absolute top-0"
                style={{
                  width: "100%",
                  height: 3,
                  background: "#1F7A3A",
                }}
              />
            )}
            <div className="relative">
              <Icon
                size={22}
                color={active ? "#1F7A3A" : "#5A6B7A"}
                strokeWidth={active ? 2.4 : 2}
                fill={active ? "#1F7A3A" : "none"}
              />
              {showDot && (
                <div
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#C8102E",
                  }}
                />
              )}
            </div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: active ? "#1F7A3A" : "#5A6B7A",
              }}
            >
              {t(it.labelKey, state.lang)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
