import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { DeleteCategoryUseCase } from '@/application/category/use-cases/delete-category'
import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { ReactivateCategoryUseCase } from '@/application/category/use-cases/reactivate-category'
import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { CreateItemUseCase } from '@/application/item/use-cases/create-item'
import { DeleteItemUseCase } from '@/application/item/use-cases/delete-item'
import { FetchItemsUseCase } from '@/application/item/use-cases/fetch-items'
import { RestoreItemUseCase } from '@/application/item/use-cases/restore-item'
import { UpdateItemUseCase } from '@/application/item/use-cases/update-item'
import { DatabaseModule } from '../database/database.module'
import { HealthCheckController } from './crontrollers/app/health-check.controller'
import { CreateCategoryController } from './crontrollers/category/create-category.controller'
import { DeleteCategoryController } from './crontrollers/category/delete-category.controller'
import { FetchCategoriesController } from './crontrollers/category/fetch-categories.controller'
import { ReactivateCategoryController } from './crontrollers/category/reactivate-category.controller'
import { UpdateCategoryController } from './crontrollers/category/update-category.controller'
import { CreateItemController } from './crontrollers/item/create-item.controller'
import { DeleteItemController } from './crontrollers/item/delete-item.controller'
import { FetchItemsController } from './crontrollers/item/fetch-items.controller'
import { RestoreItemController } from './crontrollers/item/restore-item.controller'
import { UpdateItemController } from './crontrollers/item/update-item.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    // ===== APP
    HealthCheckController,
    // ===== Category
    CreateCategoryController,
    FetchCategoriesController,
    UpdateCategoryController,
    DeleteCategoryController,
    ReactivateCategoryController,
    // ===== Item
    CreateItemController,
    FetchItemsController,
    UpdateItemController,
    DeleteItemController,
    RestoreItemController,
  ],
  providers: [
    // ===== Category
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    UpdateCategoryUseCase,
    DeleteCategoryUseCase,
    ReactivateCategoryUseCase,
    // ===== Item
    CreateItemUseCase,
    FetchItemsUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    RestoreItemUseCase,
  ],
})
export class HttpModule {}
