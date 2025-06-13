import { Order } from '@/domain/order/order'

export abstract class OrderRepository {
  abstract save(order: Order): Promise<void>
}
