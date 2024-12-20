import { LoadBalancingAlgorithm } from "~src/modules/load-balancer/types/load-balancing-algorithm.abstract";
import {
  MicroserviceGroupDetails,
  MicroserviceInfo,
} from "~src/modules/load-balancer/types/microservices.types";
import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";
import { generateInteger } from "~src/modules/utils/helpers/randomInteger.helper";

export class LeastConnections implements LoadBalancingAlgorithm {
  readonly algorithmName = LoadBalancingAlgorithmNames.LEAST_CONNECTIONS;
  selectService(groupDetails: MicroserviceGroupDetails): MicroserviceInfo {
    const { microservices } = groupDetails;
    if (groupDetails.type === "sync") {
      const index = generateInteger(0, microservices.length - 1);
      return microservices[index];
    }

    let best = microservices[0];
    for (const s of microservices.slice(1)) {
      if ("queueSize" in s.metrics && "queueSize" in best.metrics) {
        if (s.metrics.queueSize < best.metrics.queueSize) {
          best = s;
        }
      }
    }
    return best;
  }
}
