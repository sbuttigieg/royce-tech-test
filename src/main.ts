import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3000;
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger:
      process.env.ENV === 'dev'
        ? ['debug', 'log', 'verbose', 'warn', 'error']
        : false,
  });
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
