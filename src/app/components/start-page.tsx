import { useState } from "react";
import { motion } from "motion/react";
import { LANGUAGES, t, type Language } from "./i18n";
import { Check } from "lucide-react";

interface StartPageProps {
  onLanguageSelected: (lang: Language) => void;
  currentLanguage?: Language | null;
}

export function StartPage({ onLanguageSelected, currentLanguage = null }: StartPageProps) {
  const [selectedLang, setSelectedLang] = useState<Language | null>(currentLanguage);

  const handleContinue = () => {
    if (selectedLang) {
      onLanguageSelected(selectedLang);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #EEF2F5 0%, #D6DCE1 100%)",
      }}
    >
      
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0L80 80M80 0L0 80M40 0L40 80M0 40L80 40' stroke='%230B1F33' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "80px 80px",
        }}
      />

      
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(31, 122, 58, 0.15) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div
              className="rounded flex items-center justify-center"
              style={{ width: 36, height: 36, background: "#1F7A3A" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 13l9-9 9 9v8a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-8z"
                  fill="white"
                />
              </svg>
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#0B1F33",
                letterSpacing: "-0.02em",
              }}
            >
              FloodMap
            </div>
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 400,
              color: "#5A6B7A",
              lineHeight: 1.6,
            }}
          >
            {selectedLang ? t("startTagline", selectedLang) : "Stay safe during floods"}
          </div>
        </div>

        
        <div className="mb-3">
          <div
            className="mb-3 text-center"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#5A6B7A",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {selectedLang ? t("chooseLanguage", selectedLang) : "Choose your language"}
          </div>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.code;
              return (
                <motion.button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-between p-4 rounded-lg transition-all"
                  style={{
                    background: isSelected ? "rgba(31, 122, 58, 0.08)" : "white",
                    border: `1.5px solid ${isSelected ? "#1F7A3A" : "rgba(11,31,51,0.1)"}`,
                    cursor: "pointer",
                    boxShadow: isSelected
                      ? "0 2px 8px rgba(31, 122, 58, 0.15)"
                      : "0 1px 3px rgba(11, 31, 51, 0.06)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 17,
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? "#1F7A3A" : "#0B1F33",
                    }}
                  >
                    {lang.nativeLabel}
                  </span>
                  {isSelected && (
                    <Check size={18} style={{ color: "#1F7A3A", strokeWidth: 2.5 }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        
        {selectedLang && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleContinue}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-lg transition-all"
            style={{
              background: "#1F7A3A",
              color: "white",
              fontSize: 17,
              fontWeight: 600,
              boxShadow: "0 4px 12px rgba(31, 122, 58, 0.3)",
              cursor: "pointer",
              marginTop: 16,
            }}
          >
            {t("continueButton", selectedLang)}
          </motion.button>
        )}
      </div>
    </div>
  );
}
