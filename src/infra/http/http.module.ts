import { Module } from '@nestjs/common'

import { HealthCheckController } from './crontrollers/app/health-check.controller'
import { ExampleController } from './crontrollers/example/example.controller'

@Module({
  controllers: [HealthCheckController, ExampleController],
  providers: [],
})
export class HttpModule {}
