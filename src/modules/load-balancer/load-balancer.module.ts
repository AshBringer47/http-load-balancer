import { Module } from "@nestjs/common";
import { LoadBalancer } from "~src/modules/load-balancer/managers/load-balancer.manager";
import { QueueManager } from "~src/modules/load-balancer/managers/queue.manager";
import { RequestModule } from "~src/modules/requests/request.module";
import { MongooseDatabaseModule } from "~src/database/database.module";
import { LoadBalancerController } from "~src/modules/load-balancer/controllers/load-balancer.controller";

@Module({
  imports: [MongooseDatabaseModule, RequestModule],
  providers: [LoadBalancer, QueueManager],
  exports: [LoadBalancer, QueueManager],
  controllers: [LoadBalancerController],
})
export class LoadBalancerModule {}
