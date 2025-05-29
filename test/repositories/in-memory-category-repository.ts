import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Category } from '@/domain/category/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  categories: Category[] = []

  async existsByName(name: string): Promise<boolean> {
    return this.categories.some(category => category.name === name)
  }

  async save(category: Category): Promise<void> {
    this.categories.push(category)
  }
}
