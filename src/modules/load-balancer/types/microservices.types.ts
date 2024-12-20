import { AsyncMetrics, Metrics, SyncMetrics } from "advanced-balancing-metrics";

export type MicroserviceGroupType = "sync" | "async";

export type MicroserviceInfo = {
  name: string;
  url: string;
  metrics: Metrics;
};

export type MicroserviceGroupDetails = {
  type: MicroserviceGroupType;
  microservices: MicroserviceInfo[];
};

export interface AsyncMicroserviceInfo {
  name: string;
  url: string;
  metrics: AsyncMetrics;
}

export interface SyncMicroserviceInfo {
  name: string;
  url: string;
  metrics: SyncMetrics;
}

export type MicroservicesDetails = {
  [groupName: string]: MicroserviceGroupDetails;
};
