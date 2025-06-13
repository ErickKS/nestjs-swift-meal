import { Order } from '../order'
import { OrderStatus } from './order-status'
import { OrderStatusCompleted } from './order-status-completed'

export class OrderStatusReady implements OrderStatus {
  value(): string {
    return 'READY'
  }

  pay(order: Order): void {
    throw new Error('Order already paid')
  }

  prepare(order: Order): void {
    throw new Error('Order already prepared')
  }

  ready(order: Order): void {
    throw new Error('Order already ready')
  }

  complete(order: Order): void {
    order.changeStatus(new OrderStatusCompleted())
  }

  cancel(order: Order): void {
    throw new Error('Cannot cancel a ready order')
  }
}
