import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  // 👇 Serve files from the "uploads" folder
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.useStaticAssets(join(__dirname, '..', 'powerpoint'), {
    prefix: '/powerPoint/',
  });
  app.useStaticAssets(join(__dirname, '..', 'shadows_unveiled'));
  //await app.listen(3001, '0.0.0.0');
  // await app.listen(3001, '0.0.0.0');

  await app.listen(3000);
  console.log('Application is running on 3004');
}
bootstrap();
