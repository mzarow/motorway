import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  setupSwagger(app);

  await app.listen(3000);
}

const setupSwagger = (app: INestApplication) => {
  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder().setTitle('Motorway Task API').build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, options));
  }
};

bootstrap();
