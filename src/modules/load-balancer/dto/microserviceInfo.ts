import { ApiProperty } from "@nestjs/swagger";

export class MicroserviceInfo {
  @ApiProperty()
  correlationId: string;
  @ApiProperty()
  serviceName: string;
}
