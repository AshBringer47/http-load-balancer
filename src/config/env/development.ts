import { IConfig, NodeEnvTypes } from "../types/interface";
import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";

const applicationDevelopmentConfig: IConfig = {
  nodeEnv: NodeEnvTypes.development,
  server: {
    host: "0.0.0.0",
    port: 2000,
  },
  db: {
    connectionName: "default",
    uri: "mongodb://localhost:27017/diploma",
  },
  app: {
    name: "Load Balancer",
    abbr: "LB",
    version: "1.0.0",
    documentation: {
      title: "API",
      description: "REST API Documentation",
      prefix: "/api/docs",
    },
    routes: {
      mainPrefix: "/api/v1",
    },
  },
  loadBalancer: {
    algorithm: LoadBalancingAlgorithmNames.ADVANCED,
    rabbitMqUrl: "amqp://localhost",
  },
} as const;

export default applicationDevelopmentConfig;
