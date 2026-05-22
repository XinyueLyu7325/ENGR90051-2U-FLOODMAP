import { useState } from "react";
import { motion } from "motion/react";
import { Volume2, MessageSquare, Vibrate, BadgeCheck, BellRing } from "lucide-react";
import { getAlerts, Alert } from "../data";
import { useApp } from "../state";
import { LANGUAGES, t } from "../i18n";

const SEV: Record<string, { color: string; label: string }> = {
  emergency: { color: "#C62828", label: "EMERGENCY" },
  warning: { color: "#EF6C00", label: "WARNING" },
  watch: { color: "#F9A825", label: "WATCH" },
};

export function AlertsScreen() {
  const { isDesktop, state } = useApp();
  const lang = state.lang;
  const ALERTS = getAlerts(lang);
  const [playing, setPlaying] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<string>("en");

  return (
    <div className="px-4 py-4" style={{ maxWidth: isDesktop ? 720 : "auto", margin: "0 auto" }}>
      
      <div className="flex items-center gap-2 mb-1">
        <span style={{ fontSize: 22, fontWeight: 600, color: "#0B2545", letterSpacing: "-0.01em" }}>
          {t("cityCouncil", lang as any)}
        </span>
        <BadgeCheck size={20} color="#1E88E5" />
      </div>
      <div style={{ fontSize: 14, color: "#6E7C8A", lineHeight: 1.4, marginBottom: 16 }}>
        {t("allAlertsWritten", lang)}
      </div>

      <button
        onClick={() => alert(t("sendTestAlert", lang))}
        className="w-full rounded-2xl p-4 mb-4 flex items-center gap-3 text-left transition-all hover:shadow-md active:scale-98"
        style={{
          background: "rgba(30,136,229,0.1)",
          border: "1px solid rgba(30,136,229,0.18)",
          color: "#0B2545",
        }}
      >
        <span
          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#1E88E5", color: "white" }}
        >
          <BellRing size={18} />
        </span>
        <span className="flex-1">
          <span style={{ display: "block", fontSize: 16, fontWeight: 700 }}>
            {t("sendTestAlert", lang)}
          </span>
          <span style={{ display: "block", fontSize: 13, color: "#5A6B7A", marginTop: 2, lineHeight: 1.35 }}>
            {t("allAlertsWritten", lang)}
          </span>
        </span>
      </button>

      
      <div className="space-y-3">
        {ALERTS.map((a) => {
          const sev = SEV[a.severity];
          return (
            <div
              key={a.id}
              className="rounded-2xl overflow-hidden flex"
              style={{
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.5)",
                boxShadow: "0 4px 12px -6px rgba(11,37,69,0.1), inset 0 1px 0 rgba(255,255,255,0.7)",
              }}
            >
              <div style={{ width: 5, background: sev.color }} />
              <div className="flex-1 p-4">
                
                <div className="flex items-center gap-3 mb-2">
                  <span style={{ fontSize: 10, fontWeight: 700, color: sev.color, letterSpacing: "0.12em" }}>
                    {t(`severity${a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}` as any, lang as any)}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Volume2 size={13} color={a.channels.includes("voice") ? "#0B2545" : "#C9D1D8"} />
                    <MessageSquare size={13} color={a.channels.includes("sms") ? "#0B2545" : "#C9D1D8"} />
                    <Vibrate size={13} color={a.channels.includes("vibration") ? "#0B2545" : "#C9D1D8"} />
                  </div>
                  <span style={{ fontSize: 12, color: "#6E7C8A", marginLeft: "auto" }}>
                    {a.time}
                  </span>
                </div>

                <div style={{ fontSize: 17, fontWeight: 600, color: "#0B2545", lineHeight: 1.3 }}>
                  {t(a.headlineKey as any, lang as any)}
                </div>
                <div style={{ fontSize: 14, color: "#44525F", marginTop: 6, lineHeight: 1.45 }}>
                  {t(a.bodyKey as any, lang as any)}
                </div>

                
                <button
                  onClick={() => setPlaying(playing === a.id ? null : a.id)}
                  className="mt-3 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all hover:shadow-md active:scale-98"
                  style={{ background: "#F4F6F8" }}
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: sev.color, color: "white" }}
                  >
                    <Volume2 size={14} />
                  </span>
                  <div className="flex-1 text-left">
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#0B2545" }}>
                      {playing === a.id ? t("playing", lang as any).replace("…", "…") : t("hearIt", lang as any)}
                    </div>
                    <div style={{ fontSize: 11, color: "#6E7C8A" }}>
                      {t("voicedBy", lang as any)} {a.voicedBy}
                    </div>
                  </div>
                  {playing === a.id && (
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <motion.span
                          key={i}
                          className="w-0.5 rounded-full"
                          style={{ background: sev.color }}
                          animate={{ height: [4, 14, 4] }}
                          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.08 }}
                        />
                      ))}
                    </div>
                  )}
                </button>

                
                <div className="mt-3">
                  <div style={{ fontSize: 11, color: "#6E7C8A", fontWeight: 600, marginBottom: 6 }}>
                    {t("audioOtherLangs", lang as any)}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          setSelectedLang(l.code);
                          setPlaying(a.id);
                          setTimeout(() => setPlaying(null), 2000);
                        }}
                        className="px-2.5 py-1 rounded-full transition-all hover:shadow-sm active:scale-95"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: selectedLang === l.code && playing === a.id ? "white" : "#0B2545",
                          background: selectedLang === l.code && playing === a.id
                            ? "linear-gradient(135deg, #1E88E5, #1565C0)"
                            : "rgba(11,37,69,0.06)",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Volume2 size={10} />
                        {l.nativeLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3" style={{ fontSize: 11, color: "#6E7C8A" }}>
                  {t("issuedBy", lang as any)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
