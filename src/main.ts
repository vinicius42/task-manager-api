import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, //transform: true — ativa a transformação automática (o class-transformer)
    whitelist: true //whitelist: true — rejeita campos que não estão no DTO
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();