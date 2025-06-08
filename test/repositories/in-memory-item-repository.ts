import { FetchItemsSearchParams, ItemStatus } from '@/application/item/@types/fetch-items-search-filters'
import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Item } from '@/domain/item/item'

export class InMemoryItemRepository implements ItemRepository {
  items: Item[] = []

  private applyFilters(params: FetchItemsSearchParams): Item[] {
    const { code, name, categoryId, status, sortOrder = 'asc', page = 1, perPage = 10 } = params
    const normalize = (text: string) => text.toLowerCase().trim()
    let filtered = [...this.items]
    if (code) filtered = filtered.filter(item => item.code === code)
    if (name) filtered = filtered.filter(item => normalize(item.name).includes(normalize(name)))
    if (categoryId) filtered = filtered.filter(item => item.categoryId === categoryId)
    if (status) {
      filtered = filtered.filter(item => {
        switch (status) {
          case ItemStatus.ACTIVE:
            return item.active && !item.isDeleted()
          case ItemStatus.INACTIVE:
            return !item.active && !item.isDeleted()
          case ItemStatus.DELETED:
            return item.isDeleted()
        }
      })
    }
    return filtered
  }

  async existsByCode(code: string): Promise<boolean> {
    return this.items.some(item => item.code === code)
  }

  async findById(id: string): Promise<Item | null> {
    return this.items.find(item => item.id === id) || null
  }

  async findMany(params: FetchItemsSearchParams): Promise<Item[]> {
    const filtered = this.applyFilters(params)
    const { page = 1, perPage = 10, sortOrder = 'asc' } = params
    const start = (page - 1) * perPage
    const end = start + perPage
    const sorted = filtered.sort((a, b) => (sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)))
    return sorted.slice(start, end)
  }

  async save(item: Item): Promise<void> {
    this.items.push(item)
  }

  async update(item: Item): Promise<void> {
    const index = this.items.findIndex(i => i.id === item.id)
    if (index !== -1) this.items[index] = item
  }

  async count(params: FetchItemsSearchParams): Promise<number> {
    return this.applyFilters(params).length
  }
}
