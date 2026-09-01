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
  | "resetSimulation";

type TranslationDict = Record<TranslationKey, string>;

export const translations: Record<Language, TranslationDict> = {
  en: {
    dashboard: "Dashboard",
    map: "Risk Map",
    prediction: "AI Prediction",
    monitoring: "Live Monitoring",
    alerts: "Alerts",
    locations: "Locations",
    analytics: "Analytics",
    emergency: "Emergency Response",
    about: "About",
    systemOnline: "System Online",
    demoMode: "DEMO / SIMULATION MODE",
    demoDisclaimer: "Prototype estimates only. This system is NOT intended for real-world emergency decisions.",
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
    monitoring: "लाइव निगरानी",
    alerts: "अलर्ट",
    locations: "स्थान",
    analytics: "विश्लेषण",
    emergency: "आपातकालीन प्रतिक्रिया",
    about: "परिचय",
    systemOnline: "सिस्टम ऑनलाइन",
    demoMode: "डेमो / सिमुलेशन मोड",
    demoDisclaimer: "केवल प्रोटोटाइप अनुमान। यह प्रणाली वास्तविक आपातकालीन निर्णयों के लिए नहीं है।",
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
    monitoring: "লাইভ নিৰীক্ষণ",
    alerts: "সতৰ্কতা",
    locations: "স্থানসমূহ",
    analytics: "বিশ্লেষণ",
    emergency: "জৰুৰীকালীন প্ৰতিক্ৰিয়া",
    about: "বিষয়ে",
    systemOnline: "চিছটেম অনলাইন",
    demoMode: "ডেমো / ছিমুলেচন মোড",
    demoDisclaimer: "কেৱল প্ৰটটাইপ অনুমান। এই ব্যৱস্থা বাস্তৱ জৰুৰীকালীন সিদ্ধান্তৰ বাবে নহয়।",
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
