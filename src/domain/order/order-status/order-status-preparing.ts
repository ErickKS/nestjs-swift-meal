import { Order } from '../order'
import { OrderStatus } from './order-status'
import { OrderStatusReady } from './order-status-ready'

export class OrderStatusPreparing implements OrderStatus {
  value(): string {
    return 'PREPARING'
  }

  pay(order: Order): void {
    throw new Error('Order already paid')
  }

  prepare(order: Order): void {
    throw new Error('Order already in preparation')
  }

  ready(order: Order): void {
    order.changeStatus(new OrderStatusReady())
  }

  complete(order: Order): void {
    throw new Error('Order not ready yet')
  }

  cancel(order: Order): void {
    throw new Error('Cannot cancel a prepared order')
  }
}
