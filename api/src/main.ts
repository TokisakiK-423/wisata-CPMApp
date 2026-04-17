import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔥 WAJIB biar folder public bisa diakses
  app.use('/uploads', express.static(join(process.cwd(), 'public/uploads')));

  await app.listen(3000);
}
bootstrap();
