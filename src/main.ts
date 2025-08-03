import tracingService from '@/infra/tracing/tracing'

import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { patchNestJsSwagger } from 'nestjs-zod'
import { AppModule } from './app.module'
import { EnvService } from './infra/env/env.service'
import { CustomLogger } from './infra/logger/custom-logger.service'

async function bootstrap() {
  await tracingService.start()

  const app = await NestFactory.create(AppModule)
  const configService = app.get(EnvService)
  const port = configService.get('PORT')

  app.useLogger(app.get(CustomLogger))

  const config = new DocumentBuilder()
    .setTitle('Swift Meal')
    .setDescription('NestJS Project')
    .setVersion('1.0')
    .addTag('App', 'General app and health endpoints')
    .addTag('Customers', 'Operations for customer data')
    .addTag('Categories', 'Endpoints managing categories')
    .addTag('Items', 'Manage product items and their details')
    .addTag('Orders', 'Create and manage orders')
    .addTag('Payments', 'Payment processing endpoints')
    .build()
  patchNestJsSwagger()
  const documentFactory = SwaggerModule.createDocument(app, config)
  app.use(
    '/docs',
    apiReference({
      spec: { content: documentFactory },
      theme: 'kepler',
    })
  )

  await app.listen(port)
}
bootstrap()
