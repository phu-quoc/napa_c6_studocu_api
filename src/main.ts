import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '@/bases/exceptions/exception.filter';
import { PORT } from '@/bases/environments';
import { ResponseInterceptor } from '@/bases/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const appConfig = app.get(ConfigService);
  const port = appConfig.get<number>('port', 3000);
  const apiPrefix = appConfig.get<string>('apiPrefix');

  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, () => {
    Logger.log(`Server listening on: http://localhost:${PORT}`, `Running`);
    Logger.log(`API docs: http://localhost:${PORT}/docs`, `APIDocs`);
  });
}

bootstrap();
