import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();
  const port = process.env.PORT || 7000;
  await app.listen(port);
  console.log(`Server running on port ${port} 🚀`);
}
bootstrap();
