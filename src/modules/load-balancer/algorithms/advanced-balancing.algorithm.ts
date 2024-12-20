import { LoadBalancingAlgorithm } from "~src/modules/load-balancer/types/load-balancing-algorithm.abstract";
import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";
import {
  MicroserviceGroupDetails,
  MicroserviceInfo,
} from "~src/modules/load-balancer/types/microservices.types";
import { AsyncMetrics, SyncMetrics } from "advanced-balancing-metrics";
import _CONFIG from "~src/config";

export class AdvancedBalancingAlgorithm implements LoadBalancingAlgorithm {
  private readonly ALPHA: number;
  private readonly BETTA: number;
  private readonly GAMMA: number;
  private readonly NORMALIZED_ALPHA: number;
  private readonly NORMALIZED_BETTA: number;
  readonly algorithmName = LoadBalancingAlgorithmNames.ADVANCED;

  constructor() {
    this.ALPHA = _CONFIG.loadBalancer.alpha || 0.4;
    this.BETTA = _CONFIG.loadBalancer.beta || 0.3;
    this.GAMMA = _CONFIG.loadBalancer.gamma || 0.3;
    this.NORMALIZED_ALPHA = this.ALPHA / (this.ALPHA + this.BETTA);
    this.NORMALIZED_BETTA = this.BETTA / (this.ALPHA + this.BETTA);
  }

  selectService(groupDetails: MicroserviceGroupDetails): MicroserviceInfo {
    const { microservices, type } = groupDetails;
    const calculateFunction = this.getCalculateFunction(type);
    let best = microservices[0];
    let bestCost = calculateFunction(best);
    for (const s of microservices.slice(1)) {
      const cost = calculateFunction(s);
      if (cost < bestCost) {
        bestCost = cost;
        best = s;
      }
    }
    return best;
  }

  private getCalculateFunction(
    type: string,
  ): (service: MicroserviceInfo) => number {
    if (type === "sync") {
      return this.calculateSyncCost;
    }
    return this.calculateAsyncCost;
  }

  private calculateAsyncCost(service: MicroserviceInfo): number {
    const normalizedMetrics = this.normalizeAsyncMetrics(
      service.metrics as AsyncMetrics,
    );
    return (
      this.ALPHA * (1 - normalizedMetrics.cpuUsage) +
      this.BETTA * (1 - normalizedMetrics.ramUsage) +
      this.GAMMA * (1 - normalizedMetrics.queueSize)
    );
  }

  private calculateSyncCost(service: MicroserviceInfo): number {
    const normalizedMetrics = this.normalizeSyncMetrics(
      service.metrics as AsyncMetrics,
    );
    return (
      this.NORMALIZED_ALPHA * (1 - normalizedMetrics.cpuUsage) +
      this.NORMALIZED_BETTA * (1 - normalizedMetrics.ramUsage)
    );
  }

  private normalizeAsyncMetrics(metrics: AsyncMetrics): AsyncMetrics {
    return {
      cpuUsage: metrics.cpuUsage / 100,
      ramUsage: metrics.ramUsage / 100,
      queueSize: metrics.queueSize / 50,
    };
  }

  private normalizeSyncMetrics(metrics: SyncMetrics): SyncMetrics {
    return {
      cpuUsage: metrics.cpuUsage / 100,
      ramUsage: metrics.ramUsage / 100,
    };
  }
}
