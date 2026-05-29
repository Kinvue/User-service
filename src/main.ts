import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import {USER_PROTO_PATH} from "@kinvue/contracts/dist/gen/constants"
import { USER_V1_PACKAGE_NAME } from '@kinvue/contracts/dist/gen/user';
import { join } from 'path';
import { LoggerInterceptor } from './interseptors/logger.interseptor';

async function bootstrap() {
  const logger = new Logger("Main");
  const host = process.env.AUTH_GRPC_HOST ?? '0.0.0.0';
  const port = process.env.AUTH_GRPC_PORT ?? '50052';

  logger.log("Setup User-service...");
  const app = await NestFactory.createMicroservice(AppModule, {
    transport : Transport.GRPC,
    options: {
      package: USER_V1_PACKAGE_NAME,
      protoPath: join(process.cwd(), USER_PROTO_PATH),
      url: `${host}:${port}`,
    }
  })
  logger.log("Setup User-service completed");

  app.useGlobalInterceptors(new LoggerInterceptor())

  await app.listen();
  logger.log(`Service started on: ${host}:${port}`);
}
bootstrap();
