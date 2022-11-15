import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  app.setGlobalPrefix('/v1/api', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(3000);
}
bootstrap();
