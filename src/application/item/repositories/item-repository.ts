import { Item } from '@/domain/item/item'
import { FetchItemsSearchParams } from '../@types/fetch-items-search-filters'

export abstract class ItemRepository {
  abstract existsByCode(code: string): Promise<boolean>
  abstract findMany(params: FetchItemsSearchParams): Promise<Item[]>
  abstract count(params: FetchItemsSearchParams): Promise<number>
  abstract save(item: Item): Promise<void>
}
