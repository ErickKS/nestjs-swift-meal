import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface ReactivateCategoryInput {
  categoryId: string
}

@Injectable()
export class ReactivateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ categoryId }: ReactivateCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')
    category.reactivate()
    await this.categoryRepository.update(category)
  }
}
