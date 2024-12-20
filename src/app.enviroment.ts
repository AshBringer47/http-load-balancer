import { NodeEnvTypes } from "./config/types/interface";

export const environment = process.env.NODE_ENV;
export const isDevelopmentEnv = Object.is(
  environment,
  NodeEnvTypes.development,
);
export const isProductionEnv = Object.is(environment, NodeEnvTypes.production);
export const isStagingEnv = Object.is(environment, NodeEnvTypes.staging);
export const isSandboxEnv = Object.is(environment, NodeEnvTypes.sandbox);

export default {
  environment,
  isDevelopmentEnv,
  isProductionEnv,
  isStagingEnv,
  isSandboxEnv,
};
