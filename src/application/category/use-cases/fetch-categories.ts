import { Category } from '@/domain/category/category'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { CategoryStatus, FetchCategoriesSearchParams } from '../@types/fetch-categories-search-filters'
import { CategoryRepository } from '../repositories/category-repository'

interface FetchCategoriesOutput {
  categories: Category[]
}

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  @Span()
  async execute({ status = CategoryStatus.ACTIVE, sortOrder = 'asc' }: FetchCategoriesSearchParams): Promise<FetchCategoriesOutput> {
    const categories = await this.categoryRepository.findMany({ status, sortOrder })
    return { categories }
  }
}
