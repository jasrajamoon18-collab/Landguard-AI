import type { UserRegistration, AlertHistoryEntry, DeliveryChannels } from "@/types/user";
import type { RiskLevel } from "@/types/risk";
import type { Location, DataStatus } from "@/types";
import { isWithinRadius } from "@/utils/geo";
import { sendHighAlert, sendCriticalAlert, checkNotificationPermission } from "./notificationService";
import { sendEmergencySMS, formatDemoSms, type SmsResult } from "./smsService";
import { supabase } from "./supabaseClient";

// ============================================================
// Alert Engine Service
// ============================================================
// Monitors risk scores and triggers alerts when risk escalates.
// Uses deduplication to prevent alert spam.
// ============================================================

interface LastAlertState {
  riskLevel: RiskLevel;
  riskScore: number;
  timestamp: number;
  locationId: string;
}

const lastAlertStates = new Map<string, LastAlertState>();
const DEDUP_WINDOW_MS = 60 * 60 * 1000; // 1 hour — don't re-alert same level within this window
const SIGNIFICANT_INCREASE = 15; // points — trigger alert if score jumps this much

export interface AlertTriggerResult {
  triggered: boolean;
  alertLevel: RiskLevel;
  riskScore: number;
  locationName: string;
  deliveryChannels: DeliveryChannels;
  smsResult: SmsResult | null;
  isDemo: boolean;
  reason: string;
  historyEntry: AlertHistoryEntry | null;
}

export function shouldTriggerAlert(
  registration: UserRegistration,
  location: Location,
): { shouldTrigger: boolean; reason: string } {
  if (!registration.emergency_alerts_on) {
    return { shouldTrigger: false, reason: "Emergency alerts disabled" };
  }

  const minLevel = registration.min_alert_level;
  const level = location.riskLevel;

  // Check minimum alert level threshold
  if (minLevel === "CRITICAL" && level !== "CRITICAL") {
    return { shouldTrigger: false, reason: `Below minimum alert level (${minLevel})` };
  }
  if (minLevel === "HIGH" && level !== "HIGH" && level !== "CRITICAL") {
    return { shouldTrigger: false, reason: `Below minimum alert level (${minLevel})` };
  }

  // Check geographic proximity
  const withinRadius = isWithinRadius(
    registration.lat,
    registration.lng,
    location.lat,
    location.lng,
    registration.alert_radius_km,
  );
  if (!withinRadius) {
    return { shouldTrigger: false, reason: "Outside alert radius" };
  }

  // Deduplication check
  const lastState = lastAlertStates.get(registration.id ?? "temp");
  if (lastState) {
    const timeSinceLast = Date.now() - lastState.timestamp;
    const sameLevel = lastState.riskLevel === level;
    const sameLocation = lastState.locationId === location.id;

    if (sameLevel && sameLocation && timeSinceLast < DEDUP_WINDOW_MS) {
      return { shouldTrigger: false, reason: "Duplicate alert suppressed (same level within 1 hour)" };
    }

    // Check for significant increase
    const scoreIncrease = location.riskScore - lastState.riskScore;
    if (scoreIncrease < SIGNIFICANT_INCREASE && sameLevel && timeSinceLast < DEDUP_WINDOW_MS) {
      return { shouldTrigger: false, reason: "Score increase not significant enough" };
    }
  }

  return { shouldTrigger: true, reason: `Risk escalated to ${level}` };
}

export async function triggerAlert(
  registration: UserRegistration,
  location: Location,
  isDemo: boolean,
): Promise<AlertTriggerResult> {
  const level = location.riskLevel;
  const score = location.riskScore;
  const locationName = `${location.name}, ${location.state}`;

  // Update dedup state
  lastAlertStates.set(registration.id ?? "temp", {
    riskLevel: level,
    timestamp: Date.now(),
    locationId: location.id,
    riskScore: score,
  });

  const deliveryChannels: DeliveryChannels = {};
  let smsResult: SmsResult | null = null;

  // Web notification
  if (registration.notification_alerts_on) {
    const perm = checkNotificationPermission();
    if (perm === "granted") {
      let notifSent = false;
      if (level === "CRITICAL") {
        notifSent = sendCriticalAlert(location.name, score);
      } else if (level === "HIGH") {
        notifSent = sendHighAlert(location.name, score);
      }
      deliveryChannels.web = notifSent ? "SENT" : "DENIED";
    } else {
      deliveryChannels.web = "DENIED";
    }
  } else {
    deliveryChannels.web = "OFF";
  }

  // SMS
  if (registration.sms_alerts_on) {
    smsResult = sendEmergencySMS(registration, level, score, locationName, isDemo);
    deliveryChannels.sms = smsResult.isDemo ? "DEMO" : smsResult.sent ? "SENT" : "PENDING";
  } else {
    deliveryChannels.sms = "OFF";
  }

  // In-app is always active for HIGH/CRITICAL
  deliveryChannels.inApp = "ACTIVE";

  // Build message
  const message = buildAlertMessage(level, score, locationName, isDemo);

  // Build history entry
  const historyEntry: AlertHistoryEntry = {
    registration_id: registration.id,
    location_name: locationName,
    risk_score: score,
    risk_level: level,
    alert_type: isDemo ? "demo" : level === "CRITICAL" ? "emergency" : level === "HIGH" ? "warning" : "advisory",
    delivery_channels: deliveryChannels,
    message,
    is_demo: isDemo,
  };

  // Persist to database
  try {
    if (supabase) {
      await supabase.from("alert_history").insert({
        registration_id: registration.id,
        location_name: locationName,
        risk_score: score,
        risk_level: level,
        alert_type: historyEntry.alert_type,
        delivery_channels: deliveryChannels,
        message,
        is_demo: isDemo,
      });
    }
  } catch {
    // Non-blocking — alert still triggered in-app
  }

  return {
    triggered: true,
    alertLevel: level,
    riskScore: score,
    locationName,
    deliveryChannels,
    smsResult,
    isDemo,
    reason: `Risk escalated to ${level}`,
    historyEntry,
  };
}

function buildAlertMessage(level: RiskLevel, score: number, locationName: string, isDemo: boolean): string {
  const prefix = isDemo ? "[DEMO ALERT] " : "";
  if (level === "CRITICAL") {
    return `${prefix}LANDGUARD EMERGENCY ALERT — CRITICAL LANDSLIDE RISK at ${locationName}. Risk Score: ${score}/100. Move away from unstable slopes and follow official instructions.`;
  }
  if (level === "HIGH") {
    return `${prefix}LANDGUARD WARNING — High landslide risk detected near ${locationName}. Risk Score: ${score}/100. Stay away from steep slopes and known landslide-prone areas.`;
  }
  if (level === "MODERATE") {
    return `${prefix}LANDGUARD Advisory — Elevated risk at ${locationName}. Risk Score: ${score}/100. Increase monitoring and report ground cracks to local authorities.`;
  }
  return `${prefix}LANDGUARD — Risk level updated for ${locationName}. Score: ${score}/100.`;
}

export function formatSmsPreview(result: SmsResult): string {
  return formatDemoSms(result);
}

export function clearAlertState(registrationId?: string): void {
  if (registrationId) {
    lastAlertStates.delete(registrationId);
  } else {
    lastAlertStates.clear();
  }
}
