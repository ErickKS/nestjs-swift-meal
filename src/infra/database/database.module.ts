import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
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
  ],
  exports: [PrismaService, CategoryRepository, ItemRepository],
})
export class DatabaseModule {}
