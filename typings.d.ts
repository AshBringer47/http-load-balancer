import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ALGORITHM: LoadBalancingAlgorithmNames;
      MONGO_DB_URI: string;
    }
  }
}

export {};
