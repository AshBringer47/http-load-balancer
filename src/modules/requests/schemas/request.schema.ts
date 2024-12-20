import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RequestDocument = HydratedDocument<Request>;

@Schema()
export class Request {
  @Prop()
  correlation_id: string;

  @Prop({
    type: {
      group_id: String,
      method: String,
      body: {
        type: { data: [Number] },
      },
    },
  })
  request_data: {
    group_id: string;
    method: string;
    body: {
      data: number[];
    };
  };

  @Prop()
  client_service_id: string;

  @Prop()
  assigned_service_id: string;

  @Prop()
  retry_number?: number;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const RequestSchema = SchemaFactory.createForClass(Request);
