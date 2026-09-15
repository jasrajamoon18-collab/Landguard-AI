/*
# Create alert_registrations and alert_history tables

1. New Tables
- `alert_registrations`: Stores user alert subscription preferences.
  - id (uuid PK)
  - full_name (text) — user's full name
  - mobile_number (text) — phone number for SMS alerts
  - state (text) — NER state
  - district (text) — district within the state
  - village (text) — village or city
  - lat (numeric) — latitude of monitoring location
  - lng (numeric) — longitude of monitoring location
  - preferred_language (text) — one of: en, hi, as, bn, ta, ne, mni, mzo, kha
  - alert_radius_km (int) — 5, 10, 20, or 50 km
  - emergency_alerts_on (bool) — whether emergency alerts are enabled
  - notification_alerts_on (bool) — browser notifications
  - sms_alerts_on (bool) — SMS alerts
  - min_alert_level (text) — HIGH or CRITICAL
  - created_at (timestamptz)
  - updated_at (timestamptz)

- `alert_history`: Records of alerts delivered to users.
  - id (uuid PK)
  - registration_id (uuid FK -> alert_registrations)
  - location_name (text)
  - risk_score (int)
  - risk_level (text) — LOW, MODERATE, HIGH, CRITICAL
  - alert_type (text) — advisory, warning, emergency, demo
  - delivery_channels (jsonb) — { web: "SENT"|"DENIED", sms: "DEMO"|"SENT"|"OFF", inApp: "ACTIVE" }
  - message (text)
  - is_demo (bool) — true for simulated alerts
  - created_at (timestamptz)

2. Security
- Both tables use TO anon, authenticated policies (no-auth prototype).
- Full CRUD for anon + authenticated.
- Phone numbers are stored but not publicly exposed in the UI.
*/

CREATE TABLE IF NOT EXISTS alert_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  mobile_number text NOT NULL,
  state text NOT NULL,
  district text NOT NULL,
  village text,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  preferred_language text NOT NULL DEFAULT 'en',
  alert_radius_km int NOT NULL DEFAULT 20,
  emergency_alerts_on boolean NOT NULL DEFAULT true,
  notification_alerts_on boolean NOT NULL DEFAULT true,
  sms_alerts_on boolean NOT NULL DEFAULT true,
  min_alert_level text NOT NULL DEFAULT 'HIGH',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE alert_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_registrations" ON alert_registrations;
CREATE POLICY "anon_select_registrations" ON alert_registrations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_registrations" ON alert_registrations;
CREATE POLICY "anon_insert_registrations" ON alert_registrations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_registrations" ON alert_registrations;
CREATE POLICY "anon_update_registrations" ON alert_registrations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_registrations" ON alert_registrations;
CREATE POLICY "anon_delete_registrations" ON alert_registrations FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS alert_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id uuid REFERENCES alert_registrations(id) ON DELETE CASCADE,
  location_name text NOT NULL,
  risk_score int NOT NULL,
  risk_level text NOT NULL,
  alert_type text NOT NULL DEFAULT 'warning',
  delivery_channels jsonb NOT NULL DEFAULT '{}'::jsonb,
  message text NOT NULL,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE alert_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_alert_history" ON alert_history;
CREATE POLICY "anon_select_alert_history" ON alert_history FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_alert_history" ON alert_history;
CREATE POLICY "anon_insert_alert_history" ON alert_history FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_alert_history" ON alert_history;
CREATE POLICY "anon_update_alert_history" ON alert_history FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_alert_history" ON alert_history;
CREATE POLICY "anon_delete_alert_history" ON alert_history FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_alert_history_created ON alert_history (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alert_registrations_lat_lng ON alert_registrations (lat, lng);
