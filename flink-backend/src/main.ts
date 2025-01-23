import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    transform: true
    , whitelist: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  app.use(morgan('dev'));
  app.use(helmet());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
