import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/application/category/use-cases/create-category'
import { DeleteCategoryUseCase } from '@/application/category/use-cases/delete-category'
import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { ReactivateCategoryUseCase } from '@/application/category/use-cases/reactivate-category'
import { UpdateCategoryUseCase } from '@/application/category/use-cases/update-category'
import { CreateCustomerUseCase } from '@/application/customer/use-cases/create-customer'
import { FetchCustomersUseCase } from '@/application/customer/use-cases/fetch-customers'
import { GetCustomerByDocumentUseCase } from '@/application/customer/use-cases/get-customer-by-document'
import { CreateItemUseCase } from '@/application/item/use-cases/create-item'
import { DeleteItemUseCase } from '@/application/item/use-cases/delete-item'
import { FetchItemsUseCase } from '@/application/item/use-cases/fetch-items'
import { GetItemByIdUseCase } from '@/application/item/use-cases/get-item-by-id'
import { RestoreItemUseCase } from '@/application/item/use-cases/restore-item'
import { UpdateItemUseCase } from '@/application/item/use-cases/update-item'
import { DatabaseModule } from '../database/database.module'
import { HealthCheckController } from './controllers/app/health-check.controller'
import { CreateCategoryController } from './controllers/category/create-category.controller'
import { DeleteCategoryController } from './controllers/category/delete-category.controller'
import { FetchCategoriesController } from './controllers/category/fetch-categories.controller'
import { ReactivateCategoryController } from './controllers/category/reactivate-category.controller'
import { UpdateCategoryController } from './controllers/category/update-category.controller'
import { CreateCustomerController } from './controllers/customer/create-customer.controller'
import { FetchCustomersController } from './controllers/customer/fetch-customers.controller'
import { GetCustomerByDocumentController } from './controllers/customer/get-customer-by-document.controller'
import { CreateItemController } from './controllers/item/create-item.controller'
import { DeleteItemController } from './controllers/item/delete-item.controller'
import { FetchItemsController } from './controllers/item/fetch-items.controller'
import { GetItemByIdController } from './controllers/item/get-item-by-id.controller'
import { RestoreItemController } from './controllers/item/restore-item.controller'
import { UpdateItemController } from './controllers/item/update-item.controller'

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
    GetItemByIdController,
    FetchItemsController,
    UpdateItemController,
    DeleteItemController,
    RestoreItemController,
    // ===== Customer
    CreateCustomerController,
    GetCustomerByDocumentController,
    FetchCustomersController,
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
    GetItemByIdUseCase,
    FetchItemsUseCase,
    UpdateItemUseCase,
    DeleteItemUseCase,
    RestoreItemUseCase,
    // ===== Customer
    CreateCustomerUseCase,
    GetCustomerByDocumentUseCase,
    FetchCustomersUseCase,
  ],
})
export class HttpModule {}
