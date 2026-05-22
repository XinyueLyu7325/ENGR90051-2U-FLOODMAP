import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { t, type Language } from "./i18n";

type AlertMode = "calm" | "watch" | "emergency";

type Severity = "severe" | "moderate" | "minor";

interface AlertBannerProps {
  mode: AlertMode;
  lang: Language;
  onRiskFocus?: (focus: { x: number; y: number }) => void;
}

const RISK_COORDS: Record<string, { x: number; y: number } | undefined> = {
  "flood-maribyrnong": { x: 900, y: 1600 },
  "flood-footscray": { x: 3140, y: 1760 },
  "flood-kensington": { x: 2360, y: 1700 },
  "road-closure": { x: 2400, y: 1500 },
  "power": { x: 3700, y: 1480 },
  "river-rising": { x: 2400, y: 1450 },
};

const SEVERITY_COLOR: Record<Severity, string> = {
  severe: "#C8102E",
  moderate: "#E07B2C",
  minor: "#F4C430",
};

function getRisks(mode: AlertMode, lang: Language): { id: string; severity: Severity; title: string; detail: string }[] {
  if (mode === "emergency") {
    return [
      { id: "flood-maribyrnong", severity: "severe", title: lang === "zh" ? "马里宾农河 · 严重洪涝" : lang === "vi" ? "Sông Maribyrnong · Lũ lớn" : "Maribyrnong River · Severe flooding", detail: t("emergencyDetailList1", lang) },
      { id: "flood-footscray", severity: "severe", title: lang === "zh" ? "Footscray 低洼区 · 严重" : lang === "vi" ? "Vùng trũng Footscray · Nghiêm trọng" : "Footscray lowlands · Severe", detail: t("emergencyDetailList3", lang) },
      { id: "flood-kensington", severity: "moderate", title: lang === "zh" ? "Kensington · 中度积水" : lang === "vi" ? "Kensington · Ngập vừa" : "Kensington · Moderate water", detail: t("emergencyDetailList2", lang) },
      { id: "road-closure", severity: "moderate", title: lang === "zh" ? "主干道封闭 · 道路中断" : lang === "vi" ? "Đường chính đóng · Gián đoạn" : "Arterial road closure", detail: t("emergencyDetailList4", lang) },
      { id: "power", severity: "minor", title: lang === "zh" ? "局部断电风险" : lang === "vi" ? "Nguy cơ mất điện cục bộ" : "Localized power outage risk", detail: lang === "zh" ? "请提前为设备充电" : lang === "vi" ? "Sạc thiết bị trước" : "Charge devices in advance" },
    ];
  }
  return [
    { id: "river-rising", severity: "moderate", title: lang === "zh" ? "河水上涨 · 监测中" : lang === "vi" ? "Nước sông dâng · Theo dõi" : "River rising · monitored", detail: t("watchDetailList1", lang) },
    { id: "kit-prep", severity: "minor", title: lang === "zh" ? "请准备撤离包" : lang === "vi" ? "Chuẩn bị bộ sơ tán" : "Prepare evacuation kit", detail: t("watchDetailList2", lang) },
    { id: "plan", severity: "minor", title: lang === "zh" ? "复核撤离计划" : lang === "vi" ? "Xem lại kế hoạch" : "Review evacuation plan", detail: t("watchDetailList3", lang) },
    { id: "alerts", severity: "minor", title: lang === "zh" ? "保持警觉接收警报" : lang === "vi" ? "Cảnh giác cảnh báo" : "Stay alert for warnings", detail: t("watchDetailList4", lang) },
  ];
}

export function AlertBanner({ mode, lang, onRiskFocus }: AlertBannerProps) {
  const [expanded, setExpanded] = useState(false);

  if (mode === "calm") return null;

  const isEmergency = mode === "emergency";
  const bannerText = t(isEmergency ? "emergencyBanner" : "watchBanner", lang);
  const risks = getRisks(mode, lang);
  const severeCount = risks.filter((r) => r.severity === "severe").length;
  const moderateCount = risks.filter((r) => r.severity === "moderate").length;
  const minorCount = risks.filter((r) => r.severity === "minor").length;

  return (
    <motion.div
      initial={false}
      animate={{ height: expanded ? "auto" : 40 }}
      className="relative overflow-hidden cursor-pointer"
      onClick={() => setExpanded((e) => !e)}
      style={{
        background: isEmergency ? "#A8253E" : "transparent",
        border: isEmergency ? "none" : "1.5px solid #B8651F",
        color: isEmergency ? "white" : "#B8651F",
      }}
    >
      
      {isEmergency && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            backgroundPosition: ["200% 0%", "-200% 0%"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}

      
      <div
        className="flex items-center justify-between px-4 gap-3"
        style={{ height: 40 }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {bannerText}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {severeCount > 0 && (
            <SeverityChip color={SEVERITY_COLOR.severe} label={`${severeCount}`} onDark={isEmergency} />
          )}
          {moderateCount > 0 && (
            <SeverityChip color={SEVERITY_COLOR.moderate} label={`${moderateCount}`} onDark={isEmergency} />
          )}
          {minorCount > 0 && (
            <SeverityChip color={SEVERITY_COLOR.minor} label={`${minorCount}`} onDark={isEmergency} />
          )}
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
          >
            <ChevronDown size={18} color={isEmergency ? "white" : "#B8651F"} />
          </motion.div>
        </div>
      </div>

      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 pb-4"
            style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 500 }}
          >
            <p style={{ marginBottom: 10, opacity: 0.9 }}>
              {t(isEmergency ? "emergencyDetailText" : "watchDetailText", lang)}
            </p>
            <div className="flex flex-col gap-2">
              {risks.map((r) => {
                const coords = RISK_COORDS[r.id];
                const clickable = !!coords && !!onRiskFocus;
                return (
                  <button
                    key={r.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (clickable && coords) {
                        onRiskFocus!(coords);
                        setExpanded(false);
                      }
                    }}
                    disabled={!clickable}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-left transition-all active:scale-98"
                    style={{
                      background: isEmergency ? "rgba(255,255,255,0.12)" : "rgba(184,101,31,0.08)",
                      border: `1px solid ${isEmergency ? "rgba(255,255,255,0.18)" : "rgba(184,101,31,0.18)"}`,
                      cursor: clickable ? "pointer" : "default",
                    }}
                  >
                    <span
                      className="rounded-full shrink-0"
                      style={{
                        width: 10,
                        height: 10,
                        background: SEVERITY_COLOR[r.severity],
                        boxShadow: `0 0 8px ${SEVERITY_COLOR[r.severity]}`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div style={{ fontWeight: 700, fontSize: 13 }}>{r.title}</div>
                      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{r.detail}</div>
                    </div>
                    {clickable && (
                      <span style={{ fontSize: 11, fontWeight: 700, opacity: 0.75, whiteSpace: "nowrap" }}>
                        {lang === "zh" ? "查看 →" : lang === "vi" ? "Xem →" : "View →"}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SeverityChip({ color, label, onDark }: { color: string; label: string; onDark: boolean }) {
  return (
    <span
      className="flex items-center gap-1 rounded-full"
      style={{
        padding: "2px 8px",
        background: onDark ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)",
        border: `1px solid ${onDark ? "rgba(255,255,255,0.25)" : "rgba(11,31,51,0.08)"}`,
        fontSize: 11,
        fontWeight: 700,
        color: onDark ? "white" : "#0B1F33",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span
        className="rounded-full"
        style={{ width: 7, height: 7, background: color, boxShadow: `0 0 6px ${color}` }}
      />
      {label}
    </span>
  );
}
