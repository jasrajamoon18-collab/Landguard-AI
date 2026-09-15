import type { RiskLevel } from "./risk";
import type { DataStatus } from "./location";

export type AlertLanguage = "en" | "hi" | "as" | "bn" | "ta" | "ne" | "mni" | "mzo" | "kha";

export type AlertRadiusKm = 5 | 10 | 20 | 50;

export type MinAlertLevel = "HIGH" | "CRITICAL";

export type DeliveryChannel = "SENT" | "DENIED" | "OFF" | "DEMO" | "ACTIVE" | "PENDING";

export interface DeliveryChannels {
  web?: DeliveryChannel;
  sms?: DeliveryChannel;
  inApp?: DeliveryChannel;
}

export interface UserRegistration {
  id?: string;
  full_name: string;
  mobile_number: string;
  state: string;
  district: string;
  village?: string;
  lat: number;
  lng: number;
  preferred_language: AlertLanguage;
  alert_radius_km: AlertRadiusKm;
  emergency_alerts_on: boolean;
  notification_alerts_on: boolean;
  sms_alerts_on: boolean;
  min_alert_level: MinAlertLevel;
  created_at?: string;
  updated_at?: string;
}

export interface AlertHistoryEntry {
  id?: string;
  registration_id?: string;
  location_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  alert_type: "advisory" | "warning" | "emergency" | "demo";
  delivery_channels: DeliveryChannels;
  message: string;
  is_demo: boolean;
  created_at?: string;
}

export interface OfflineCache {
  lastRiskScore: number;
  lastRiskLevel: RiskLevel;
  lastLocation: string;
  lastRainfall: number;
  lastUpdated: string;
  dataStatus: DataStatus;
}

export type NotificationPermission = "default" | "granted" | "denied" | "unsupported";

export const ALERT_LANGUAGES: { value: AlertLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "as", label: "Assamese" },
  { value: "bn", label: "Bengali" },
  { value: "ta", label: "Tamil" },
  { value: "ne", label: "Nepali" },
  { value: "mni", label: "Manipuri" },
  { value: "mzo", label: "Mizo" },
  { value: "kha", label: "Khasi" },
];

export const ALERT_RADII: AlertRadiusKm[] = [5, 10, 20, 50];

export const NER_DISTRICTS: Record<string, string[]> = {
  "Arunachal Pradesh": ["Itanagar", "Tawang", "Bomdila", "Ziro", "Pasighat", "Tezu", "Changlang", "Naharlagun"],
  "Assam": ["Guwahati", "Dima Hasao", "Karbi Anglong", "Silchar", "Dibrugarh", "Jorhat", "Tezpur", "Nagaon"],
  "Meghalaya": ["East Khasi Hills", "West Khasi Hills", "Shillong", "Cherrapunji", "Jowai", "Tura", "Nongstoin"],
  "Manipur": ["Imphal East", "Imphal West", "Ukhrul", "Senapati", "Churachandpur", "Thoubal", "Bishnupur"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Saiha", "Kolasib", "Serchhip", "Mamit"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Mon", "Wokha", "Phek"],
  "Tripura": ["Agartala", "Dharmanagar", "Udaipur", "Kailashahar", "Ambassa", "Khowai"],
  "Sikkim": ["Gangtok", "Namchi", "Geyzing", "Mangan", "Rangpo", "Pelling", "Ravangla"],
};
