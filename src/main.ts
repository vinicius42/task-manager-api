import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true, //transform: true — ativa a transformação automática (o class-transformer)
    whitelist: true //whitelist: true — rejeita campos que não estão no DTO
  }));

  const config = new DocumentBuilder();

  config
    .setTitle('Task Manager API')
    .setDescription('API para gerenciamento de tarefas')
    .setVersion('1.0')
    .addBearerAuth();

  const document = SwaggerModule.createDocument(app, config.build());

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();