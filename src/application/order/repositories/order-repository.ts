import { Order } from '@/domain/order/order'
import { FetchOrdersSearchParams } from '../@types/fetch-orders-search-filters'

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findMany(params: FetchOrdersSearchParams): Promise<Order[]>
  abstract save(order: Order): Promise<void>
  abstract count(params: FetchOrdersSearchParams): Promise<number>
}
