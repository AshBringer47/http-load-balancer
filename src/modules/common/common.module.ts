import { Module } from "@nestjs/common";
import { MongooseDatabaseModule } from "~src/database/database.module";
import { CommonController } from "./controllers/common.controller";
import { RequestModule } from "~src/modules/requests/request.module";
import { LoadBalancerModule } from "~src/modules/load-balancer/load-balancer.module";

@Module({
  imports: [MongooseDatabaseModule, RequestModule, LoadBalancerModule],
  controllers: [CommonController],
  providers: [],
})
export class CommonModule {}
