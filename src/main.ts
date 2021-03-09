import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NotFoundInterceptor } from './interceptors/not-found.interceptor'
import { Logger } from './logger'

const logger = new Logger('Main')

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger })
  app.setGlobalPrefix('api/v1')
  app.useGlobalInterceptors(new NotFoundInterceptor())
  app.enableCors()
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  )
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  const swaggerOptions = new DocumentBuilder()
    .setTitle('Note App Backend')
    .setDescription('API documentation for the Note App Backend')
    .setVersion('1')
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('api-docs', app, document)
  await app.listen(3000)
}
bootstrap().catch((err) => logger.error(`Boostrap failed: ${err.message}`))
