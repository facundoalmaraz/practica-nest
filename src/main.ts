import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina los campos que no están en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían campos que no están en el DTO
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
