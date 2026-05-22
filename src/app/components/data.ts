import { t, Language } from "./i18n";

export type Pin = {
  id: string;
  name: string;
  emoji: string;
  type: "shelter" | "kitchen" | "supply" | "medical" | "school" | "boat" | "active";
  color: string;
  status: "OPEN" | "FULL" | "CLOSED" | "RISK" | "ACTIVE";
  statusColor: string;
  distanceKm: number;
  walkMin: number;
  x: number;
  y: number;
  capacity?: { used: number; total: number };
  photoCaption?: string;
  openingHours?: string;
  services?: string[];
  meals?: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
  supplies?: {
    item: string;
    remaining: number;
    unit: string;
  }[];
  medicalServices?: string[];
  staff?: number;
};

export const getPins = (lang: Language): Pin[] => [
  {
    id: "fcac",
    name: t("fcacName", lang),
    emoji: "🛏️",
    type: "shelter",
    color: "#2E7D32",
    status: "OPEN",
    statusColor: "#2E7D32",
    distanceKm: 0.6,
    walkMin: 8,
    x: 75,
    y: 25,
    capacity: { used: 142, total: 200 },
    photoCaption: t("fcacCaption", lang),
    openingHours: t("hours247", lang),
    services: [t("serviceSleeping", lang), t("serviceShowers", lang), t("serviceCharging", lang), t("serviceWiFi", lang), t("servicePet", lang)],
    staff: 8,
  },
  {
    id: "mac",
    name: t("macName", lang),
    emoji: "🛏️",
    type: "shelter",
    color: "#2E7D32",
    status: "OPEN",
    statusColor: "#2E7D32",
    distanceKm: 1.2,
    walkMin: 16,
    x: 25,
    y: 25,
    capacity: { used: 89, total: 350 },
    openingHours: t("hours247", lang),
    services: [t("serviceSleeping", lang), t("serviceShowers", lang), t("serviceMedical", lang), t("serviceCharging", lang), t("serviceChildren", lang)],
    staff: 12,
  },
  {
    id: "kitchen",
    name: t("kitchenName", lang),
    emoji: "🍲",
    type: "kitchen",
    color: "#EF6C00",
    status: "OPEN",
    statusColor: "#EF6C00",
    distanceKm: 0.4,
    walkMin: 5,
    x: 75,
    y: 50,
    openingHours: t("hoursKitchen", lang),
    meals: {
      breakfast: t("mealBreakfast", lang),
      lunch: t("mealLunch", lang),
      dinner: t("mealDinner", lang),
    },
    services: [t("serviceHotMeals", lang), t("serviceWater", lang), t("serviceDietary", lang), t("serviceTakeaway", lang)],
    staff: 6,
  },
  {
    id: "supply",
    name: t("supplyName", lang),
    emoji: "📦",
    type: "supply",
    color: "#1E88E5",
    status: "OPEN",
    statusColor: "#1E88E5",
    distanceKm: 0.9,
    walkMin: 12,
    x: 25,
    y: 75,
    openingHours: t("hoursSupply", lang),
    supplies: [
      { item: t("supplyBottled", lang), remaining: 340, unit: t("unitBottles", lang) },
      { item: t("supplyBlankets", lang), remaining: 78, unit: t("unitUnits", lang) },
      { item: t("supplyFlashlights", lang), remaining: 45, unit: t("unitUnits", lang) },
      { item: t("supplyKits", lang), remaining: 23, unit: t("unitKits", lang) },
      { item: t("supplyBaby", lang), remaining: 12, unit: t("unitCans", lang) },
    ],
    services: [t("serviceFreeDist", lang), t("serviceNoID", lang), t("serviceMax2", lang)],
  },
  {
    id: "medical",
    name: t("medicalName", lang),
    emoji: "🏥",
    type: "medical",
    color: "#C62828",
    status: "OPEN",
    statusColor: "#C62828",
    distanceKm: 0.7,
    walkMin: 9,
    x: 50,
    y: 25,
    openingHours: t("hoursMedical", lang),
    medicalServices: [t("serviceFirstAid", lang), t("serviceMeds", lang), t("serviceMental", lang), t("serviceChronic", lang)],
    staff: 4,
    services: [t("serviceDoc", lang), t("serviceFreeMed", lang), t("serviceAmbulance", lang)],
  },
  {
    id: "school",
    name: t("schoolName", lang),
    emoji: "🏫",
    type: "school",
    color: "#9C27B0",
    status: "OPEN",
    statusColor: "#9C27B0",
    distanceKm: 0.5,
    walkMin: 7,
    x: 25,
    y: 50,
    capacity: { used: 62, total: 150 },
    openingHours: t("hours247", lang),
    services: [t("serviceFamily", lang), t("serviceKidsActs", lang), t("serviceStudy", lang), t("serviceWiFi", lang), t("serviceBooks", lang)],
    staff: 5,
  },
  {
    id: "boat",
    name: t("boatName", lang),
    emoji: "⛵",
    type: "boat",
    color: "#1E88E5",
    status: "OPEN",
    statusColor: "#1E88E5",
    distanceKm: 0.3,
    walkMin: 4,
    x: 50,
    y: 62.5,
    openingHours: t("hoursBoat", lang),
    services: [t("serviceWaterRes", lang), t("serviceTrans", lang), t("serviceTrained", lang), t("serviceFree", lang)],
    staff: 3,
  },
  {
    id: "active",
    name: t("activeName", lang),
    emoji: "⚠️",
    type: "active",
    color: "#C62828",
    status: "ACTIVE",
    statusColor: "#C62828",
    distanceKm: 0.2,
    walkMin: 3,
    x: 37.5,
    y: 62.5,
    photoCaption: t("activeCaption", lang),
  },
];

export type Alert = {
  id: string;
  severity: "emergency" | "warning" | "watch";
  headlineKey: any;
  bodyKey: any;
  time: string;
  voicedBy: string;
  channels: ("voice" | "sms" | "vibration")[];
};

export const getAlerts = (lang: Language): Alert[] => [
  {
    id: "a1",
    severity: "emergency",
    headlineKey: "alert1Headline",
    bodyKey: "alert1Body",
    time: t("alertTime1", lang),
    voicedBy: t("alertVoice1", lang),
    channels: ["voice", "sms", "vibration"],
  },
  {
    id: "a2",
    severity: "warning",
    headlineKey: "alert2Headline",
    bodyKey: "alert2Body",
    time: t("alertTime2", lang),
    voicedBy: t("alertVoice2", lang),
    channels: ["sms", "vibration"],
  },
];
