import type { NotificationPermission } from "@/types/user";

export function checkNotificationPermission(): NotificationPermission {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission as NotificationPermission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) return "unsupported";
  try {
    const result = await Notification.requestPermission();
    return result as NotificationPermission;
  } catch {
    return "denied";
  }
}

export function sendLocalNotification(
  title: string,
  body: string,
  options?: { tag?: string; icon?: string; data?: unknown },
): boolean {
  if (!("Notification" in window)) return false;
  if (Notification.permission !== "granted") return false;

  try {
    const notification = new Notification(title, {
      body,
      tag: options?.tag,
      icon: options?.icon,
      data: options?.data as Record<string, unknown>,
      requireInteraction: false,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    setTimeout(() => notification.close(), 15000);
    return true;
  } catch {
    return false;
  }
}

export function sendHighAlert(locationName: string, riskScore: number): boolean {
  return sendLocalNotification(
    "LANDGUARD WARNING",
    `High landslide risk detected near ${locationName}. Risk Score: ${riskScore}/100. Stay away from steep slopes and landslide-prone areas.`,
    { tag: `high-${locationName}-${Date.now()}` },
  );
}

export function sendCriticalAlert(locationName: string, riskScore: number): boolean {
  return sendLocalNotification(
    "LANDGUARD EMERGENCY ALERT",
    `CRITICAL landslide risk near ${locationName}. Risk Score: ${riskScore}/100. Move away from unstable slopes and follow official instructions.`,
    { tag: `critical-${locationName}-${Date.now()}` },
  );
}
