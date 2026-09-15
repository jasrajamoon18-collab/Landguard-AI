import type { UserRegistration } from "@/types/user";
import type { RiskLevel } from "@/types/risk";

export interface SmsResult {
  sent: boolean;
  isDemo: boolean;
  message: string;
  recipient: string;
  body: string;
}

// SMS service — modular architecture for future SMS provider integration.
// For the hackathon prototype, this is DEMO MODE only.
// No SMS provider secrets live in frontend code.
// When a real provider is connected, create a Supabase Edge Function
// that holds the API key server-side and calls this provider's API.

export function sendEmergencySMS(
  user: UserRegistration,
  riskLevel: RiskLevel,
  riskScore: number,
  locationName: string,
  isDemo: boolean,
): SmsResult {
  const body = buildSmsBody(riskLevel, riskScore, locationName, user.preferred_language);

  if (isDemo) {
    return {
      sent: false,
      isDemo: true,
      message: "DEMO SMS — not actually sent. No SMS provider connected.",
      recipient: maskNumber(user.mobile_number),
      body,
    };
  }

  // In production: POST to a Supabase Edge Function that holds the SMS provider key.
  // For now, return as demo since no provider is connected.
  return {
    sent: false,
    isDemo: true,
    message: "No SMS provider connected — message logged as DEMO.",
    recipient: maskNumber(user.mobile_number),
    body,
  };
}

function maskNumber(number: string): string {
  if (number.length <= 4) return number;
  return number.slice(0, 2) + "****" + number.slice(-2);
}

function buildSmsBody(
  level: RiskLevel,
  score: number,
  locationName: string,
  _lang: string,
): string {
  if (level === "CRITICAL") {
    return `CRITICAL LANDSLIDE ALERT. Critical risk near ${locationName}. Risk Score: ${score}/100. Move away from unstable slopes and follow official instructions.`;
  }
  if (level === "HIGH") {
    return `LANDSLIDE WARNING. High risk near ${locationName}. Risk Score: ${score}/100. Avoid steep slopes and landslide-prone areas.`;
  }
  return `LANDGUARD Advisory. Elevated risk near ${locationName}. Risk Score: ${score}/100. Stay alert.`;
}

export function formatDemoSms(result: SmsResult): string {
  return `[DEMO SMS]
To: ${result.recipient}

${result.body}

---
This is a DEMO message. No real SMS was sent.`;
}
