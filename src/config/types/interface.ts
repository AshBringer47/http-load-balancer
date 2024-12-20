import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";

export enum NodeEnvTypes {
  production = "production",
  sandbox = "sandbox",
  staging = "staging",
  development = "development",
}

export type NodeEnv = keyof typeof NodeEnvTypes;

interface IServerConfig {
  host: string;
  port: number;
}

interface ISwaggerConfig {
  title: string;
  description: string;
  prefix: string;
}

export interface IRoutesConfig {
  mainPrefix: string;
}

interface IApplicationConfig {
  name: string;
  abbr: string;
  version: string;
  documentation: ISwaggerConfig;
  routes: IRoutesConfig;
}

export interface IConfig {
  nodeEnv: NodeEnv;
  app: IApplicationConfig;
  server: IServerConfig;
  db: {
    connectionName: string;
    uri: string;
  };
  loadBalancer: {
    maxRetries?: number;
    algorithm: LoadBalancingAlgorithmNames;
    alpha?: number;
    beta?: number;
    gamma?: number;
    rabbitMqUrl: string;
  };
}
