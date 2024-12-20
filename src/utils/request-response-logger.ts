import { ConsoleLogger } from '@nestjs/common';
import chalk from 'chalk';
import { FastifyRequest } from 'fastify/types/request';

type RequestLogOptions = {
  moduleName?: string;
};
type ResponseLogOptions = {
  startTime: number;
  moduleName?: string;
};
class RequestResponseLogger extends ConsoleLogger {
  private readonly interceptorName: string;
  constructor(interceptorName?: string) {
    super();
    this.interceptorName = interceptorName;
  }

  private getModulePrefix(moduleName?: string) {
    const prefix = moduleName ?? this.interceptorName;
    if (prefix) return chalk.yellow(`[${prefix}]`);
    return '';
  }

  private beatifyJSON(object: unknown) {
    if (!object) object = {};
    return chalk.cyanBright(JSON.stringify(object, null, 2));
  }

  public renderRequestLog(
    request: FastifyRequest,
    options?: RequestLogOptions,
  ) {
    const { headers, body, params, query, method, url } = request;
    const modulePrefix = this.getModulePrefix(options?.moduleName);
    this.debug(
      chalk.magentaBright(`${modulePrefix} Request {${url}, ${method}}`),
    );
    this.debug(
      chalk.magentaBright(
        `${modulePrefix} Headers ${this.beatifyJSON(headers)}`,
      ),
    );
    this.debug(
      chalk.magentaBright(`${modulePrefix} Body ${this.beatifyJSON(body)}`),
    );
    this.debug(
      chalk.magentaBright(`${modulePrefix} Params ${this.beatifyJSON(params)}`),
    );
    this.debug(
      chalk.magentaBright(`${modulePrefix} Query ${this.beatifyJSON(query)}`),
    );
  }

  public renderResponseLog(
    request: FastifyRequest,
    options: ResponseLogOptions,
  ) {
    const { method, url } = request;
    const modulePrefix = this.getModulePrefix(options?.moduleName);
    const elapsedTime = Date.now() - options.startTime;
    this.debug(
      chalk.magentaBright(
        `${modulePrefix} Response {${url}, ${method}} ${chalk.yellow(`+${elapsedTime}ms`)}`,
      ),
    );
  }
}

export default RequestResponseLogger;
