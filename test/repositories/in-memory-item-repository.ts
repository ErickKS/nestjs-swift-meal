import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Item } from '@/domain/item/item'

export class InMemoryItemRepository implements ItemRepository {
  items: Item[] = []

  async existsByCode(code: string): Promise<boolean> {
    return this.items.some(item => item.code === code)
  }

  async save(item: Item): Promise<void> {
    this.items.push(item)
  }
}
