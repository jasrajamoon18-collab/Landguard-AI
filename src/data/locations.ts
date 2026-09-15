// This file re-exports from fallbackData.ts for backward compatibility.
// The canonical location data now lives in src/data/fallbackData.ts (static terrain)
// and environmental data is fetched via services at runtime.

export { locationBaseData, fallbackEnvironmentalData } from "./fallbackData";
export { NER_STATES } from "@/types/location";
