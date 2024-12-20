import { ApiProperty } from "@nestjs/swagger";

export class ExceptionErrorDto {
  @ApiProperty()
  statusCode: string;
  @ApiProperty()
  timestamp: string;
  @ApiProperty()
  path: string;
  @ApiProperty()
  message: string;
  @ApiProperty()
  error: string;
}
