import { IConfig, NodeEnvTypes } from "./types/interface";

const env = process.env.NODE_ENV || NodeEnvTypes.development;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _CONFIG: IConfig = require(`./env/${env}`).default;
console.log(_CONFIG);
if (!_CONFIG) {
  throw new Error("Config for given NODE_ENV was not found");
}

export default _CONFIG;
