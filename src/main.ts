import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api');
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  app.enableCors();
  const port = process.env.PORT || 7000;

  // Create folder if not exist
  const folders = ['uploads'];
  folders.forEach((folder) => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder);
    }
  });

  await app.listen(port);
  console.log(`Server running on port ${port} 🚀`);
}
bootstrap();
