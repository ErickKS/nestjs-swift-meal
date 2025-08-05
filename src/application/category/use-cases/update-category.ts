import { Category } from '@/domain/category/category'
import { Injectable } from '@nestjs/common'
import { Span } from 'nestjs-otel'
import { CategoryRepository } from '../repositories/category-repository'

interface UpdateCategoryInput {
  categoryId: string
  name: string
}

interface UpdateCategoryOutput {
  category: Category
}

@Injectable()
export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  @Span()
  async execute({ categoryId, name }: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')
    const existingCategory = await this.categoryRepository.existsByName(name)
    if (existingCategory) throw new Error(`Category '${name}' already exists`)
    category.name = name
    await this.categoryRepository.update(category)
    return {
      category,
    }
  }
}
