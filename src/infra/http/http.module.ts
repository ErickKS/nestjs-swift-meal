import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { DeleteCategoryUseCase } from '@/application/category/use-cases/delete-category'
import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { DatabaseModule } from '../database/database.module'
import { HealthCheckController } from './crontrollers/app/health-check.controller'
import { CreateCategoryController } from './crontrollers/category/create-category.controller'
import { DeleteCategoryController } from './crontrollers/category/delete-category.controller'
import { FetchCategoriesController } from './crontrollers/category/fetch-categories.controller'
import { UpdateCategoryController } from './crontrollers/category/update-category.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    HealthCheckController,
    CreateCategoryController,
    FetchCategoriesController,
    UpdateCategoryController,
    DeleteCategoryController,
  ],
  providers: [CreateCategoryUseCase, FetchCategoriesUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase],
})
export class HttpModule {}
