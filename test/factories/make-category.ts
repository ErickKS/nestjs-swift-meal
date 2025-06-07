import { Category, CreateCategoryProps } from '@/domain/category/category'
import { PrismaCategoryMapper } from '@/infra/database/prisma/mappers/prisma-category-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeCategory(override: Partial<CreateCategoryProps> = {}, id?: string) {
  const category = Category.create(
    {
      name: faker.commerce.department(),
      ...override,
    },
    id
  )
  return category
}

@Injectable()
export class CategoryFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCategory(data: Partial<CreateCategoryProps> = {}): Promise<Category> {
    const category = makeCategory(data)
    await this.prisma.category.create({
      data: PrismaCategoryMapper.toPrisma(category),
    })
    return category
  }
}
