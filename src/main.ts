import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";
import { AppModule } from "./app.module";
import _CONFIG from "./config";
import { AllExceptionsFilter } from "./utils/filters/all-exceptions-filter";
import { AddTotalCountHeaderInterceptor } from "~src/utils/interceptors/add-total-count-header.interceptor";
import { RequestResponseLoggingInterceptor } from "~src/utils/interceptors/request-response-logging.interceptor";
import { ApplicationLogger } from "~common/logger/logger.service";
import { renderApplicationMetadata } from "./utils/logging-database-relations";
import { isDevelopmentEnv } from "./app.enviroment";

class Application {
  private application: NestFastifyApplication;
  private readonly logger: ApplicationLogger;

  constructor() {
    this.application = null;
    this.logger = new ApplicationLogger(this.constructor.name);
  }

  async initialize() {
    this.application = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
    this.setup();
    await this.start();
    this.render();
  }

  private setup() {
    this.setGlobalPrefix();
    this.setupPipes();
    this.setupFilters();
    this.setupInterceptors();
    this.setupSwagger();
    this.enableCors();
  }

  private render() {
    if (!isDevelopmentEnv) this.renderDatabaseRelations();
  }

  private renderDatabaseRelations() {
    const dataSource = this.application.get<DataSource>(getDataSourceToken());
    renderApplicationMetadata(dataSource.entityMetadatas, {
      logger: this.logger,
    });
  }

  private setGlobalPrefix() {
    const mainPrefix = _CONFIG.app.routes.mainPrefix;
    this.application.setGlobalPrefix(mainPrefix);
  }

  private setupPipes() {
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      /*transformOptions: {
              enableImplicitConversion: true,  // blocks creating items with nested fields
            },*/
    });
    this.application.useGlobalPipes(validationPipe);
  }

  private setupFilters() {
    this.application.useGlobalFilters(new AllExceptionsFilter());
  }

  private setupInterceptors() {
    this.application.useGlobalInterceptors(
      new AddTotalCountHeaderInterceptor(),
    );
    this.application.useGlobalInterceptors(
      new RequestResponseLoggingInterceptor(),
    );
  }

  private setupSwagger() {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(_CONFIG.app.documentation.title)
      .setDescription(_CONFIG.app.documentation.description)
      .setVersion(_CONFIG.app.version)
      .build();
    const document = SwaggerModule.createDocument(
      this.application,
      swaggerConfig,
    );
    SwaggerModule.setup(
      _CONFIG.app.documentation.prefix,
      this.application,
      document,
    );
  }

  private enableCors() {
    const options: CorsOptions = {
      origin: true,
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization", "x-user-id"],
      methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    };
    this.application.enableCors(options);
  }

  private async start() {
    await this.application.listen(_CONFIG.server.port, _CONFIG.server.host);
    this.logger.log(
      `Nest application is running on: ${await this.application.getUrl()}`,
    );
  }
}

const application = new Application();
application.initialize();
