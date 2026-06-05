import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from '@dad-group-1/backend-common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger('billing-service', 'info'),
  });
  const configService = app.get(ConfigService);

  const microserviceHost = configService.get<string>('HOST', '0.0.0.0');
  const microservicePort = configService.get<number>('PORT', 3003);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: microserviceHost,
      port: microservicePort,
    },
  });

  await app.startAllMicroservices();
  await app.init(); // Initialize the app without starting the HTTP server

  new Logger('Bootstrap').log(
    `Billing microservice started on ${microserviceHost}:${microservicePort}`,
  );
}
bootstrap();
