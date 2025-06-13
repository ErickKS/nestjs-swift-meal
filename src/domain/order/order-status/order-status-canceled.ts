import { Order } from '../order'
import { OrderStatus } from './order-status'

export class OrderStatusCanceled implements OrderStatus {
  value(): string {
    return 'CANCELED'
  }

  pay(order: Order): void {
    throw new Error('Order was canceled')
  }

  prepare(order: Order): void {
    throw new Error('Order was canceled')
  }

  ready(order: Order): void {
    throw new Error('Order was canceled')
  }

  complete(order: Order): void {
    throw new Error('Order was canceled')
  }

  cancel(order: Order): void {
    throw new Error('Order already canceled')
  }
}
