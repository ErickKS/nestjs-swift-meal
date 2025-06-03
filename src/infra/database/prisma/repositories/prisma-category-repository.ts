import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Category } from '@/domain/category/category'
import { Injectable } from '@nestjs/common'
import { PrismaCategoryMapper } from '../mappers/prisma-category-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async existsByName(name: string): Promise<boolean> {
    const category = await this.prisma.category.findUnique({
      where: {
        name,
      },
    })
    return !!category
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })
    if (!category) return null
    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.create({
      data,
    })
  }

  async update(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)
    await this.prisma.category.update({
      where: { id: category.id },
      data,
    })
  }
}
