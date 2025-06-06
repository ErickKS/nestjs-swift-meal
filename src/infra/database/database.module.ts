import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
  ],
  exports: [PrismaService, CategoryRepository],
})
export class DatabaseModule {}
