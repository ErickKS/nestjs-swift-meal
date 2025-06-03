import { Category } from '@/domain/category/category'
import { Injectable } from '@nestjs/common'
import { CategoryRepository } from '../repositories/category-repository'

interface FetchCategoriesOutput {
  categories: Category[]
}

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(): Promise<FetchCategoriesOutput> {
    const categories = await this.categoryRepository.findAll()
    return { categories }
  }
}
