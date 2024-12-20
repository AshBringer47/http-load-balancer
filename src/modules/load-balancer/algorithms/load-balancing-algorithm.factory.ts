import { LoadBalancingAlgorithm } from "../types/load-balancing-algorithm.abstract";
import { LoadBalancingAlgorithmNames } from "../types/load-balancing-algorithm-names.enum";
import { LeastConnections } from "./least-connections.algorithm";
import { RoundRobinAlgorithm } from "./round-robin.algorithm";
import { AdvancedBalancingAlgorithm } from "~src/modules/load-balancer/algorithms/advanced-balancing.algorithm";

export class LBAlgorithmFactory {
  static createAlgorithm(
    algorithmName: LoadBalancingAlgorithmNames,
  ): LoadBalancingAlgorithm {
    switch (algorithmName) {
      case LoadBalancingAlgorithmNames.ROUND_ROBIN:
        return new RoundRobinAlgorithm();
      case LoadBalancingAlgorithmNames.LEAST_CONNECTIONS:
        return new LeastConnections();
      case LoadBalancingAlgorithmNames.ADVANCED:
        return new AdvancedBalancingAlgorithm();
      default:
        throw new Error("Algorithm not found");
    }
  }
}
