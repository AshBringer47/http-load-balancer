import { LoadBalancingAlgorithm } from "~src/modules/load-balancer/types/load-balancing-algorithm.abstract";
import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";
import {
  MicroserviceGroupDetails,
  MicroserviceInfo,
} from "~src/modules/load-balancer/types/microservices.types";

export class RoundRobinAlgorithm implements LoadBalancingAlgorithm {
  private index = 0;
  algorithmName = LoadBalancingAlgorithmNames.ROUND_ROBIN;

  selectService(groupDetails: MicroserviceGroupDetails): MicroserviceInfo {
    const { microservices } = groupDetails;
    const service = microservices[this.index % microservices.length];
    this.index++;
    return service;
  }
}
