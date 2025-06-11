import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customer-repository'
import { PrismaItemRepository } from './prisma/repositories/prisma-item-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: ItemRepository,
      useClass: PrismaItemRepository,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
  ],
  exports: [PrismaService, CategoryRepository, ItemRepository, CustomerRepository],
})
export class DatabaseModule {}
