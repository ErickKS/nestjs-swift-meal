import { Order } from '../../order'
import { OrderStatus, OrderStatusEnum } from './order-status'

export class OrderStatusCompleted implements OrderStatus {
  value(): string {
    return OrderStatusEnum.COMPLETED
  }

  pay(order: Order): void {
    throw new Error('Order already completed')
  }

  prepare(order: Order): void {
    throw new Error('Order already completed')
  }

  ready(order: Order): void {
    throw new Error('Order already completed')
  }

  complete(order: Order): void {
    throw new Error('Order already completed')
  }

  cancel(order: Order): void {
    throw new Error('Cannot cancel a completed order')
  }
}
