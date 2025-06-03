import { CategoryStatus, FetchCategoriesSearchParams } from '@/application/category/@types/fetch-categories-search-filters'
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

  async findMany(params: FetchCategoriesSearchParams): Promise<Category[]> {
    const status = params.status ?? CategoryStatus.ACTIVE
    const sortOrder = params.sortOrder ?? 'asc'
    const filtered = this.categories.filter(category => {
      if (status === CategoryStatus.ALL) return true
      return status === CategoryStatus.ACTIVE ? category.deletedAt === null : category.deletedAt !== null
    })
    const sorted = filtered.sort((a, b) => {
      return a.name.localeCompare(b.name) * (sortOrder === 'asc' ? 1 : -1)
    })
    return sorted
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
