import { Category } from '@/domain/category/category'
import { CategoryRepository } from '../repositories/category-repository'

interface CreateCategoryInput {
  name: string
}

interface CreateCategoryOutput {
  category: Category
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const existingCategory = await this.categoryRepository.existsByName(input.name)
    if (existingCategory) throw new Error('Category already exists')
    const category = Category.create(input)
    await this.categoryRepository.save(category)
    return {
      category,
    }
  }
}
