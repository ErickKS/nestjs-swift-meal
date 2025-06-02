import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { DatabaseModule } from '../database/database.module'
import { HealthCheckController } from './crontrollers/app/health-check.controller'
import { CreateCategoryController } from './crontrollers/category/create-category.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [HealthCheckController, CreateCategoryController],
  providers: [CreateCategoryUseCase],
})
export class HttpModule {}
