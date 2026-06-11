import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWinstonLogger } from '@dad-group-1/backend-common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

dotenv.config(); // Load environment variables from .env

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: createWinstonLogger('billing-service', 'info'),
  });
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [
        {
          username: configService.getOrThrow<string>('RABBITMQ_USERNAME'),
          password: configService.getOrThrow<string>('RABBITMQ_PASSWORD'),
          hostname: configService.getOrThrow<string>('RABBITMQ_HOST'),
          port: configService.getOrThrow<number>('RABBITMQ_PORT'),
        } as RmqUrl,
      ],
      queue: `BILLING_SERVICE_QUEUE`,
      queueOptions: {
        durable: true,
      },
    },
  });
  await app.startAllMicroservices();
  await app.init(); // Initialize the app without starting the HTTP server

  new Logger('Bootstrap').log(`Billing microservice started`);
}
bootstrap();
