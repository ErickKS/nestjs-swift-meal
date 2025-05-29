import { Category } from '@/domain/category/category'

export abstract class CategoryRepository {
  abstract existsByName(name: string): Promise<boolean>
  abstract findById(id: string): Promise<Category | null>
  abstract save(category: Category): Promise<void>
  abstract update(category: Category): Promise<void>
}
