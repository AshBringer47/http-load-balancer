import { Controller, Get, Query } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ExceptionErrorDto } from "~common/dto/exception.error.dto";
import { RequestsCollectionRepository } from "~src/modules/requests/repositories/requests-collection.repository";

@ApiTags("requests")
@Controller("requests")
export class RequestController {
  constructor(
    private readonly requestsCollectionRepository: RequestsCollectionRepository,
  ) {}
  @Get("/")
  @ApiBadRequestResponse({ type: ExceptionErrorDto })
  @ApiNotFoundResponse({ type: ExceptionErrorDto })
  public async getLiveness(@Query() query: any): Promise<any> {
    await this.requestsCollectionRepository.create({
      correlationId: query.correlation_id,
    });
    return await this.requestsCollectionRepository.findByCorrelationId(
      query.correlationId,
    );
  }
}
