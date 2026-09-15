import type { Language } from "@/types";

type TranslationKey =
  | "dashboard"
  | "map"
  | "prediction"
  | "monitoring"
  | "alerts"
  | "locations"
  | "analytics"
  | "emergency"
  | "about"
  | "systemOnline"
  | "demoMode"
  | "demoDisclaimer"
  | "earlyWarning"
  | "criticalAlert"
  | "viewLocation"
  | "acknowledge"
  | "share"
  | "viewAIAnalysis"
  | "analyzeRisk"
  | "startSimulation"
  | "pauseSimulation"
  | "resetSimulation"
  | "refreshData"
  | "liveData"
  | "fallbackData"
  | "simulationMode"
  | "errorData"
  | "prototypeBadge";

type TranslationDict = Record<TranslationKey, string>;

export const translations: Record<Language, TranslationDict> = {
  en: {
    dashboard: "Dashboard",
    map: "Risk Map",
    prediction: "AI Prediction",
    monitoring: "Monitoring",
    alerts: "Alerts",
    locations: "Locations",
    analytics: "Analytics",
    emergency: "Emergency Response",
    about: "About",
    systemOnline: "System Online",
    demoMode: "PROTOTYPE / EARLY-WARNING RESEARCH SYSTEM",
    demoDisclaimer: "Not for real-world emergency decisions. Follow official disaster-management authorities.",
    refreshData: "Refresh Data",
    liveData: "LIVE DATA",
    fallbackData: "FALLBACK DATA",
    simulationMode: "SIMULATION MODE",
    errorData: "ERROR",
    prototypeBadge: "PROTOTYPE",
    earlyWarning: "Early Warning Alerts",
    criticalAlert: "Critical Alert",
    viewLocation: "View Location",
    acknowledge: "Acknowledge",
    share: "Share",
    viewAIAnalysis: "View AI Analysis",
    analyzeRisk: "Analyze Risk",
    startSimulation: "Start Landslide Simulation",
    pauseSimulation: "Pause Simulation",
    resetSimulation: "Reset Simulation",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    map: "जोखिम मानचित्र",
    prediction: "एआई पूर्वानुमान",
    monitoring: "निगरानी",
    alerts: "अलर्ट",
    locations: "स्थान",
    analytics: "विश्लेषण",
    emergency: "आपातकालीन प्रतिक्रिया",
    about: "परिचय",
    systemOnline: "सिस्टम ऑनलाइन",
    demoMode: "प्रोटोटाइप / प्रारंभिक चेतावनी अनुसंधान प्रणाली",
    demoDisclaimer: "वास्तविक आपातकालीन निर्णयों के लिए नहीं। आधिकारिक आपदा प्रबंधन अधिकारियों का पालन करें।",
    refreshData: "डेटा रिफ्रेश करें",
    liveData: "लाइव डेटा",
    fallbackData: "फॉलबैक डेटा",
    simulationMode: "सिमुलेशन मोड",
    errorData: "त्रुटि",
    prototypeBadge: "प्रोटोटाइप",
    earlyWarning: "प्रारंभिक चेतावनी अलर्ट",
    criticalAlert: "गंभीर अलर्ट",
    viewLocation: "स्थान देखें",
    acknowledge: "स्वीकार करें",
    share: "साझा करें",
    viewAIAnalysis: "एआई विश्लेषण देखें",
    analyzeRisk: "जोखिम विश्लेषण करें",
    startSimulation: "भूस्खलन सिमुलेशन शुरू करें",
    pauseSimulation: "सिमुलेशन रोकें",
    resetSimulation: "सिमुलेशन रीसेट करें",
  },
  as: {
    dashboard: "ডেচবোৰ্ড",
    map: "বিপদ মানচিত্ৰ",
    prediction: "এআই পূৰ্বানুমান",
    monitoring: "নিৰীক্ষণ",
    alerts: "সতৰ্কতা",
    locations: "স্থানসমূহ",
    analytics: "বিশ্লেষণ",
    emergency: "জৰুৰীকালীন প্ৰতিক্ৰিয়া",
    about: "বিষয়ে",
    systemOnline: "চিছটেম অনলাইন",
    demoMode: "প্ৰটটাইপ / প্ৰাৰম্ভিক সতৰ্কতা গৱেষণা ব্যৱস্থা",
    demoDisclaimer: "বাস্তৱ জৰুৰীকালীন সিদ্ধান্তৰ বাবে নহয়। আধিকাৰিক দুৰ্যোগ ব্যৱস্থাপনা কৰ্তৃপক্ষক অনুসৰণ কৰক।",
    refreshData: "ডেটা সতেজ কৰক",
    liveData: "লাইভ ডেটা",
    fallbackData: "ফলবেক ডেটা",
    simulationMode: "ছিমুলেচন মোড",
    errorData: "ভুল",
    prototypeBadge: "প্ৰটটাইপ",
    earlyWarning: "প্ৰাৰম্ভিক সতৰ্কতা",
    criticalAlert: "গুৰুতৰ সতৰ্কতা",
    viewLocation: "স্থান চাওক",
    acknowledge: "স্বীকাৰ কৰক",
    share: "তুলনা কৰক",
    viewAIAnalysis: "এআই বিশ্লেষণ চাওক",
    analyzeRisk: "বিপদ বিশ্লেষণ কৰক",
    startSimulation: "ভূস্খলন ছিমুলেচন আৰম্ভ কৰক",
    pauseSimulation: "ছিমুলেচন বিৰতি দিয়ক",
    resetSimulation: "ছিমুলেচন ৰিছেট কৰক",
  },
};

export function t(lang: Language, key: TranslationKey): string {
  return translations[lang][key] ?? translations.en[key] ?? key;
}
