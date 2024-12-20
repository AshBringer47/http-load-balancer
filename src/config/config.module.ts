import { ConfigModule as NestConfigModule } from "@nestjs/config";
import Joi from "joi";
import { NodeEnvTypes } from "./types/interface";

export const ConfigModule = NestConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
  isGlobal: true,
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid(...Object.values(NodeEnvTypes))
      .default(NodeEnvTypes.development),
    PORT: Joi.number().port().default(3000),
  }),
});
