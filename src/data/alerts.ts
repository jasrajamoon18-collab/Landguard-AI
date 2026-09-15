// Alerts are now generated dynamically by alertService.ts from calculated risk scores.
// This file is kept for backward compatibility but no longer contains static alert data.

export { generateAlertsFromLocations, generateAlertFrequencyFromAlerts } from "@/services/alertService";
