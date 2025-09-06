import { Category } from '@/domain/category/category'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface CreateCategoryInput {
  name: string
}

@Injectable()
export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  @Span()
  async execute(input: CreateCategoryInput): Promise<void> {
    const existingCategory = await this.categoryRepository.findByName(input.name)
    if (existingCategory) {
      if (existingCategory.isActive()) throw new Error('Category already exists')
      existingCategory.restore()
      await this.categoryRepository.update(existingCategory)
      return
    }
    const newCategory = Category.create(input)
    await this.categoryRepository.save(newCategory)
  }
}
