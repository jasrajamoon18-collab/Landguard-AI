import type { UserRegistration, AlertHistoryEntry } from "@/types/user";
import { supabase } from "./supabaseClient";

// ============================================================
// User Preferences Service
// ============================================================
// Manages user alert registration data via Supabase.
// Falls back to localStorage when Supabase is unavailable.
// Phone numbers are never exposed in public-facing admin views.
// ============================================================

const LOCAL_KEY = "landguard_registration";

export async function saveRegistration(
  data: UserRegistration,
): Promise<UserRegistration> {
  // Save to localStorage for offline access
  localStorage.setItem(LOCAL_KEY, JSON.stringify(data));

  // Also persist to Supabase
  try {
    if (supabase) {
      const { data: row, error } = await supabase
        .from("alert_registrations")
        .insert({
          full_name: data.full_name,
          mobile_number: data.mobile_number,
          state: data.state,
          district: data.district,
          village: data.village,
          lat: data.lat,
          lng: data.lng,
          preferred_language: data.preferred_language,
          alert_radius_km: data.alert_radius_km,
          emergency_alerts_on: data.emergency_alerts_on,
          notification_alerts_on: data.notification_alerts_on,
          sms_alerts_on: data.sms_alerts_on,
          min_alert_level: data.min_alert_level,
        })
        .select()
        .single();
      if (!error && row) {
        const saved = { ...data, id: row.id, created_at: row.created_at, updated_at: row.updated_at };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(saved));
        return saved;
      }
    }
  } catch {
    // Non-blocking — localStorage copy is already saved
  }

  return data;
}

export async function updateRegistration(
  id: string,
  data: Partial<UserRegistration>,
): Promise<UserRegistration | null> {
  const local = getLocalRegistration();
  if (local) {
    const updated = { ...local, ...data, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  }

  try {
    if (supabase) {
      const { data: row, error } = await supabase
        .from("alert_registrations")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (!error && row) {
        const result = { ...getLocalRegistration(), ...row } as UserRegistration;
        localStorage.setItem(LOCAL_KEY, JSON.stringify(result));
        return result;
      }
    }
  } catch {
    // Non-blocking
  }

  return getLocalRegistration();
}

export function getLocalRegistration(): UserRegistration | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserRegistration;
  } catch {
    return null;
  }
}

export function isRegistered(): boolean {
  return getLocalRegistration() !== null;
}

export function clearRegistration(): void {
  localStorage.removeItem(LOCAL_KEY);
}

export async function getAllRegistrations(): Promise<UserRegistration[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("alert_registrations")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        return data as UserRegistration[];
      }
    }
  } catch {
    // fall through
  }
  return [];
}

export async function getAlertHistory(limit = 50): Promise<AlertHistoryEntry[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("alert_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!error && data) {
        return data as AlertHistoryEntry[];
      }
    }
  } catch {
    // fall through
  }
  return [];
}

export async function getAlertHistoryForUser(
  registrationId: string,
  limit = 50,
): Promise<AlertHistoryEntry[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from("alert_history")
        .select("*")
        .eq("registration_id", registrationId)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!error && data) {
        return data as AlertHistoryEntry[];
      }
    }
  } catch {
    // fall through
  }
  return [];
}
