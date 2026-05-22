import { Globe } from "lucide-react";
import { t } from "./i18n";
import { useApp } from "./state";

export function CouncilBadge({ compact = false }: { compact?: boolean }) {
  const { state } = useApp();

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-lg flex items-center justify-center"
        style={{
          width: compact ? 28 : 32,
          height: compact ? 28 : 32,
          background: "#0B2545",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 13l9-9 9 9v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8z" fill="#4FC3F7" />
        </svg>
      </div>
      <div className="leading-tight">
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: 500, letterSpacing: "0.04em" }}>
          {t("topTag", state.lang)}
        </div>
        <div style={{ fontSize: 14, color: "white", fontWeight: 600 }}>
          {t("appSubtitle", state.lang)}
        </div>
      </div>
    </div>
  );
}

export function LangButton() {
  const { state } = useApp();

  return (
    <button
      className="flex items-center gap-1.5 px-3 rounded-full"
      style={{
        height: 34,
        background: "rgba(255,255,255,0.14)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.18)",
        color: "white",
      }}
    >
      <Globe size={14} />
      <span style={{ fontSize: 13, fontWeight: 600 }}>{t("language", state.lang)}</span>
    </button>
  );
}
