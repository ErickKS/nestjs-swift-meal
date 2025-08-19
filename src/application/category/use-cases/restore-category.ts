import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface ReactivateCategoryInput {
  categoryId: string
}

@Injectable()
export class RestoreCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  @Span()
  async execute({ categoryId }: ReactivateCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId)
    if (!category) throw new Error('Category not found')
    category.restore()
    await this.categoryRepository.update(category)
  }
}
