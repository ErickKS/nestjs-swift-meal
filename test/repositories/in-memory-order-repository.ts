import { OrderRepository } from '@/application/order/repositories/order-repository'
import { Order } from '@/domain/order/order'

export class InMemoryOrderRepository implements OrderRepository {
  orders: Order[] = []

  async save(order: Order): Promise<void> {
    this.orders.push(order)
  }
}
