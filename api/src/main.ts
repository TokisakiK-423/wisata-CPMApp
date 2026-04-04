import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // ← TAMBAHKAN INI
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/uploads/',
  });
  
  // rest of code...
}
