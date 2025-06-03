import { Category } from '@/domain/category/category'
import { FetchCategoriesSearchParams } from '../@types/fetch-categories-search-filters'

export abstract class CategoryRepository {
  abstract existsByName(name: string): Promise<boolean>
  abstract findById(id: string): Promise<Category | null>
  abstract findMany(params: FetchCategoriesSearchParams): Promise<Category[]>
  abstract save(category: Category): Promise<void>
  abstract update(category: Category): Promise<void>
}
