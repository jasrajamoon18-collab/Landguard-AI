import type { RiskLevel, RiskFactor } from "./risk";
import type { NERState, DataStatus } from "./location";

export interface Alert {
  id: string;
  time: string;
  locationId: string;
  locationName: string;
  state: NERState;
  riskLevel: RiskLevel;
  riskScore: number;
  reason: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "RESOLVED";
  factors: string[];
  action: string;
  dataSource: DataStatus;
}
