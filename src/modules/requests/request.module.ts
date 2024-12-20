import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestSchema, Request } from "./schemas/request.schema";
import { RequestsCollectionRepository } from "~src/modules/requests/repositories/requests-collection.repository";
import { RequestController } from "~src/modules/requests/controllers/request.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Request.name, schema: RequestSchema }]),
  ],
  providers: [RequestsCollectionRepository],
  controllers: [RequestController],
  exports: [RequestsCollectionRepository],
})
export class RequestModule {}
