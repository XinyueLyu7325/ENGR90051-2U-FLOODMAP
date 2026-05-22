import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapScreen } from "./components/screens/map-screen";
import { AlertsScreen } from "./components/screens/alerts-screen";
import { SimulateScreen } from "./components/screens/simulate-screen";
import { MeScreen } from "./components/screens/me-screen";
import { EvacuateScreen } from "./components/screens/evacuate-screen";
import { TabBar, TopBar } from "./components/chrome";
import { AppContext, defaultState, type AppState } from "./components/state";
import { StartPage } from "./components/start-page";
import { Toaster } from "sonner";
import { isSupportedLanguage, type Language } from "./components/i18n";

const LANGUAGE_STORAGE_KEY = "floodsafe_language";

export default function App() {
  const [tab, setTab] = useState<AppState["tab"]>("map");
  const [state, setState] = useState<AppState>(defaultState);
  const [evacuating, setEvacuating] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [showingStartPage, setShowingStartPage] = useState(false);
  const appContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const persistedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(persistedLang)) {
      setState((s) => ({ ...s, lang: persistedLang }));
      setHasChosenLanguage(true);
    } else {
      localStorage.removeItem(LANGUAGE_STORAGE_KEY);
      setShowingStartPage(true);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLanguageSelected = (lang: Language) => {
    setState((s) => ({ ...s, lang }));
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setHasChosenLanguage(true);
    setShowingStartPage(false);
  };

  const handleShowStartPage = () => {
    setShowingStartPage(true);
  };

  const handleRestartFromStart = () => {
    localStorage.removeItem(LANGUAGE_STORAGE_KEY);
    setHasChosenLanguage(false);
    setShowingStartPage(true);
  };

  const ctx = {
    state,
    setState,
    tab,
    setTab,
    evacuating,
    setEvacuating,
    isDesktop,
    showStartPage: handleShowStartPage,
    restartFromStart: handleRestartFromStart,
  };

  const screens: Record<AppState["tab"], React.ReactNode> = {
    map: <MapScreen />,
    alerts: <AlertsScreen />,
    simulate: <SimulateScreen />,
    me: <MeScreen />,
  };

  const textScale: Record<AppState["textSize"], number> = {
    small: 1.02,
    medium: 1.16,
    large: 1.32,
  };
  const activeTextScale = textScale[state.textSize];
  const baseFontSize = 20;

  useEffect(() => {
    const root = appContentRef.current;
    if (!root) return;

    const applyTextScale = () => root.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
      const fontSize = el.style.fontSize;
      if (!fontSize) return;

      if (!el.dataset.baseFontSize) {
        el.dataset.baseFontSize = fontSize;
      }

      const baseFontSizeValue = el.dataset.baseFontSize;
      if (!baseFontSizeValue) return;

      const px = Number.parseFloat(baseFontSizeValue);
      if (baseFontSizeValue.endsWith("px") && Number.isFinite(px)) {
        el.style.fontSize = `${px * activeTextScale}px`;
      }
    });

    applyTextScale();
    const observer = new MutationObserver(applyTextScale);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [activeTextScale, tab, evacuating, state.lang]);

  if (showingStartPage) {
    return (
      <StartPage
        onLanguageSelected={handleLanguageSelected}
        currentLanguage={hasChosenLanguage ? state.lang : null}
      />
    );
  }

  return (
    <AppContext.Provider value={ctx}>
      <Toaster position="top-center" richColors theme="light" />
      <div
        className="min-h-screen w-full"
        style={{
          background: "#EEF2F5",
          color: "#0B1F33",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontSize: `${baseFontSize * activeTextScale}px`,
        }}
      >
        <div
          ref={appContentRef}
          className="mx-auto flex flex-col"
          style={{
            maxWidth: isDesktop ? 1280 : 520,
            minHeight: "100vh",
          }}
        >
          <TopBar />
          <main className="flex-1 relative">
            <AnimatePresence mode="wait">
              {evacuating ? (
                <motion.div
                  key="evac"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35 }}
                >
                  <EvacuateScreen />
                </motion.div>
              ) : (
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {screens[tab]}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          {!evacuating && <TabBar />}
        </div>
      </div>
    </AppContext.Provider>
  );
}
