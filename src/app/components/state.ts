import { createContext, useContext } from "react";
import type { Language } from "./i18n";

export type Lang = Language;

export type AppState = {
  tab: "map" | "alerts" | "simulate" | "me";
  mode: "calm" | "watch" | "emergency";
  lang: Lang;
  arrivedSafe: boolean;
  selectedPin: string | null;
  textSize: "small" | "medium" | "large";
};

export const defaultState: AppState = {
  tab: "map",
  mode: "emergency",
  lang: "en",
  arrivedSafe: false,
  selectedPin: null,
  textSize: "medium",
};

export type Ctx = {
  state: AppState;
  setState: (u: AppState | ((s: AppState) => AppState)) => void;
  tab: AppState["tab"];
  setTab: (t: AppState["tab"]) => void;
  evacuating: boolean;
  setEvacuating: (v: boolean) => void;
  isDesktop: boolean;
  showStartPage?: () => void;
  restartFromStart?: () => void;
};

export const AppContext = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(AppContext);
