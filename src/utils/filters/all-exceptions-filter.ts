import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { ApplicationLogger } from '~common/logger/logger.service';

type ExceptionResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string[] | string;
  error: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger: ApplicationLogger;
  constructor() {
    this.logger = new ApplicationLogger(this.constructor.name);
  }

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const fastifyReply = ctx.getResponse<FastifyReply>();
    const fastifyRequest = ctx.getRequest<FastifyRequest>();

    let response: ExceptionResponse = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: fastifyRequest.url,
      message: 'Internal server error',
      error: null,
    };

    if (exception instanceof HttpException)
      response = this.getHttpExceptionResponse(exception, response);
    else if (exception instanceof QueryFailedError)
      response = this.getQueryFailedErrorResponse(exception, response);
    else if (exception instanceof Error)
      response = this.getGenericErrorResponse(exception, response);

    if (exception instanceof Error) {
      this.logger.error(exception.stack);
    } else {
      this.logger.error(exception);
    }

    fastifyReply.code(response.statusCode).send(response);
  }

  private getHttpExceptionResponse(
    exception: HttpException,
    response: ExceptionResponse,
  ): ExceptionResponse {
    const responseBody = exception.getResponse();
    return {
      ...response,
      statusCode: exception.getStatus(),
      message: responseBody['message'] || responseBody,
      error: responseBody['error'] || null,
    };
  }

  private getQueryFailedErrorResponse(
    exception: QueryFailedError,
    response: ExceptionResponse,
  ): ExceptionResponse {
    return {
      ...response,
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Database query failed',
      error: exception.message,
    };
  }

  private getGenericErrorResponse(
    exception: Error,
    response: ExceptionResponse,
  ): ExceptionResponse {
    return {
      ...response,
      error: exception.message,
    };
  }
}
