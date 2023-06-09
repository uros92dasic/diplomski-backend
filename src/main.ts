import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true //pass cookies backandforth for every request
  })

  // Set up Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addTag('your-api-tag')
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Initialize and serve the Swagger UI
  SwaggerModule.setup('api', app, document);

  await app.listen(8000);
}
bootstrap();
