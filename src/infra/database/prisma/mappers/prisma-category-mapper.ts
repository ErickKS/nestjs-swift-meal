import { Category } from '@/domain/category/category'
import { Prisma, Category as PrismaCategory } from '@prisma/client'

export class PrismaCategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return Category.create(
      {
        name: raw.name,
      },
      raw.id
    )
  }

  static toPrisma(Category: Category): Prisma.CategoryUncheckedCreateInput {
    return {
      id: Category.id,
      name: Category.name,
      createdAt: Category.createdAt,
      updatedAt: Category.updatedAt,
    }
  }
}
