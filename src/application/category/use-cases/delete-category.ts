import { Injectable } from '@nestjs/common'
import { Span } from 'nestjs-otel'
import { CategoryRepository } from '../repositories/category-repository'

interface DeleteCategoryInput {
  categoryId: string
}

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  @Span()
  async execute({ categoryId }: DeleteCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')
    category.deactivate()
    await this.categoryRepository.delete(category)
  }
}
