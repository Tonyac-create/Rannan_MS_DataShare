import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, NestMicroservice, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.connectMicroservice<MicroserviceOptions>({
    transport : Transport.NATS,
    options: {
      servers : [ `nats://localhost:4222`]
    }
  })
  
  await app.listen(3001);

  app.startAllMicroservices()
}
bootstrap();

