import { All, Controller, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ExceptionErrorDto } from "~common/dto/exception.error.dto";
import { MicroserviceInfo } from "~src/modules/load-balancer/dto/microserviceInfo";
import { LoadBalancer } from "~src/modules/load-balancer/managers/load-balancer.manager";
import {
  LBHeaders,
  LBParams,
} from "~src/modules/requests/dtos/process-request-dto";

@ApiTags("loadBalancer")
@Controller("loadBalancer")
export class LoadBalancerController {
  constructor(private readonly loadBalancer: LoadBalancer) {}

  @All("*")
  @ApiOkResponse({ type: MicroserviceInfo })
  @ApiBadRequestResponse({ type: ExceptionErrorDto })
  @ApiNotFoundResponse({ type: ExceptionErrorDto })
  async handleWildcardRoute(@Req() req: Request, @Res() res: Response) {
    const microserviceInfo = await this.loadBalancer.handleRequest({
      method: req.method,
      params: req.params as LBParams,
      body: req.body,
      headers: req.headers as LBHeaders,
    });
    return res.send({ microserviceInfo });
  }
}
