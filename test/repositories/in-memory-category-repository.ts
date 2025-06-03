import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Category } from '@/domain/category/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  categories: Category[] = []

  async existsByName(name: string): Promise<boolean> {
    return this.categories.some(category => category.name === name)
  }

  async findById(id: string): Promise<Category | null> {
    return this.categories.find(category => category.id === id) || null
  }

  async findAll(): Promise<Category[]> {
    return this.categories.sort((a, b) => a.name.localeCompare(b.name))
  }

  async save(category: Category): Promise<void> {
    this.categories.push(category)
  }

  async update(category: Category): Promise<void> {
    const index = this.categories.findIndex(i => i.id === category.id)
    if (index !== -1) {
      this.categories[index] = category
    }
  }
}
