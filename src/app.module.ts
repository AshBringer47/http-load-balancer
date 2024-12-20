import { Module } from "@nestjs/common";
import { ConfigModule } from "./config/config.module";
import { LoggerModule } from "~common/logger/logger.module";
import { MongooseDatabaseModule } from "~src/database/database.module";
import { RequestModule } from "~src/modules/requests/request.module";
import { CommonModule } from "~src/modules/common/common.module";

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    MongooseDatabaseModule,
    RequestModule,
    CommonModule,
  ],
})
export class AppModule {}
