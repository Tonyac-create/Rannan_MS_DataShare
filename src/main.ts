import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.connectMicroservice<MicroserviceOptions>({
    transport : Transport.NATS,
    options: {
      servers : [`nats://${process.env.NATS_DNS}:${process.env.NATS_PORT}`]
    }
  })

  app.startAllMicroservices()
}
bootstrap();

