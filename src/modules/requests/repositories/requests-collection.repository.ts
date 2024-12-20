import { RequestDocument, Request } from "../schemas/request.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";

@Injectable()
export class RequestsCollectionRepository {
  constructor(
    @InjectModel(Request.name)
    private requestModel: Model<RequestDocument>,
  ) {}

  async create(request: any): Promise<Request> {
    const newRequest = new this.requestModel(request);
    return await newRequest.save();
  }

  async incrementRetryCount(correlationId: string) {
    return this.requestModel.updateOne(
      { correlation_id: correlationId },
      { $inc: { retryCount: 1 } },
    );
  }

  findByCorrelationId(correlationId: string) {
    return this.requestModel
      .findOne({
        correlation_id: correlationId,
      })
      .exec();
  }
}
