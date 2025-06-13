import { Order } from '../order'
import { OrderStatus } from './order-status'
import { OrderStatusPreparing } from './order-status-preparing'

export class OrderStatusPaid implements OrderStatus {
  value(): string {
    return 'PAID'
  }

  pay(order: Order): void {
    throw new Error('Order already paid')
  }

  prepare(order: Order): void {
    order.changeStatus(new OrderStatusPreparing())
  }

  ready(order: Order): void {
    throw new Error('Order must be in preparation before being ready')
  }

  complete(order: Order): void {
    throw new Error('Order not ready yet')
  }

  cancel(order: Order): void {
    throw new Error('Cannot cancel a paid order')
  }
}
