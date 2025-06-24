import { FetchOrdersSearchParams } from '@/application/order/@types/fetch-orders-search-filters'
import { OrderRepository } from '@/application/order/repositories/order-repository'
import { Order } from '@/domain/order/order'

export class InMemoryOrderRepository implements OrderRepository {
  orders: Order[] = []

  private applyFilters(params: FetchOrdersSearchParams): Order[] {
    const { code, status } = params
    let filtered = [...this.orders]
    if (code) filtered = filtered.filter(order => order.code === code)
    if (status) filtered = filtered.filter(order => order.status === status)
    return filtered
  }

  async findById(id: string): Promise<Order | null> {
    return this.orders.find(order => order.id === id) || null
  }

  async findMany(params: FetchOrdersSearchParams): Promise<Order[]> {
    const filtered = this.applyFilters(params)
    const { page = 1, perPage = 10, sortOrder = 'asc' } = params
    const start = (page - 1) * perPage
    const end = start + perPage
    const sorted = filtered.sort((a, b) => {
      const aTime = a.createdAt.getTime()
      const bTime = b.createdAt.getTime()
      return sortOrder === 'asc' ? aTime - bTime : bTime - aTime
    })
    return sorted.slice(start, end)
  }

  async save(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async update(order: Order): Promise<void> {
    const index = this.orders.findIndex(i => i.id === order.id)
    if (index !== -1) this.orders[index] = order
  }

  async count(params: FetchOrdersSearchParams): Promise<number> {
    return this.applyFilters(params).length
  }
}
