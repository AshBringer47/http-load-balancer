import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";
import {
  MicroserviceGroupDetails,
  MicroserviceInfo,
} from "~src/modules/load-balancer/types/microservices.types";

export interface LoadBalancingAlgorithm {
  algorithmName: LoadBalancingAlgorithmNames;
  selectService(services: MicroserviceGroupDetails): MicroserviceInfo;
}
