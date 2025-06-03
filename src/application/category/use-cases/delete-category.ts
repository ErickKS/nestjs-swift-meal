import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface DeleteCategoryInput {
  categoryId: string
}

@Injectable()
export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute({ categoryId }: DeleteCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')
    if (!category.isActive()) throw new Error('Category already deleted')
    category.deactivate()
    await this.categoryRepository.delete(category)
  }
}
