import { Controller, Get, HttpStatus } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ExceptionErrorDto } from "~common/dto/exception.error.dto";
import {
  ILivenessResponse,
  ILivenessService,
} from "~src/modules/common/types/liveness.interface";
import {
  LivenessHealthStatuses,
  LivenessServices,
  LivenessStatuses,
} from "~src/modules/common/types/liveness.enum";

@ApiTags("common")
@Controller("common")
export class CommonController {
  constructor() {}
  @Get("/liveness")
  @ApiOkResponse({
    description: "Liveness probe",
  })
  @ApiBadRequestResponse({ type: ExceptionErrorDto })
  @ApiNotFoundResponse({ type: ExceptionErrorDto })
  public async getLiveness(): Promise<ILivenessResponse> {
    const dbStatus: ILivenessService = {
      status: LivenessStatuses.up,
      name: LivenessServices.database,
      condition: { health: LivenessHealthStatuses.healthy },
    };
    return {
      status: LivenessStatuses.up,
      statusCode: HttpStatus.OK,
      services: [dbStatus],
    };
  }
}
