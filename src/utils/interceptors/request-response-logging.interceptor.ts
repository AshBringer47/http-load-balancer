import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify/types/request';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import Logger from '../request-response-logger';

@Injectable()
export class RequestResponseLoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(this.constructor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const moduleName = context.getClass().name;

    this.logger.renderRequestLog(request, { moduleName });

    return next.handle().pipe(
      tap(() => {
        this.logger.renderResponseLog(request, { startTime, moduleName });
      }),
    );
  }
}
