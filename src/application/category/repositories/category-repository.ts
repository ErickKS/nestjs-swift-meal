import { Category } from '@/domain/category/category'

export abstract class CategoryRepository {
  abstract existsByName(name: string): Promise<boolean>
  abstract save(category: Category): Promise<void>
}
