import { Item } from '@/domain/item/item'

export abstract class ItemRepository {
  abstract existsByCode(code: string): Promise<boolean>
  abstract save(item: Item): Promise<void>
}
