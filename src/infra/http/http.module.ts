import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { DatabaseModule } from '../database/database.module'
import { HealthCheckController } from './crontrollers/app/health-check.controller'
import { CreateCategoryController } from './crontrollers/category/create-category.controller'
import { UpdateCategoryController } from './crontrollers/category/update-category.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [HealthCheckController, CreateCategoryController, UpdateCategoryController],
  providers: [CreateCategoryUseCase, UpdateCategoryUseCase],
})
export class HttpModule {}
