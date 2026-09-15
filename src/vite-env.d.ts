/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY?: string;
  readonly VITE_GROUND_MOVEMENT_API_URL?: string;
  readonly VITE_SOIL_MOISTURE_API_URL?: string;
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  // NASA GPM IMERG — token is stored server-side as a Supabase Edge Function secret.
  // The frontend only needs the Supabase URL (already above) to call the edge function.
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
