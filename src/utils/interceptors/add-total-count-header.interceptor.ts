import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FastifyReply } from 'fastify';

@Injectable()
export class AddTotalCountHeaderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse() as FastifyReply;

        if (data && typeof data === 'object' && 'totalCount' in data) {
          response.header('X-Total-Count', data.totalCount);

          const { totalCount, ...rest } = data;
          if (totalCount || totalCount === 0) return Object.values(rest)[0];
        }

        return data;
      }),
    );
  }
}
