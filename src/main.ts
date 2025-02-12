import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // CREATE APP AND CFG
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Gestión de Películas')
    .setDescription('API para gestionar películas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // LISTEN
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
