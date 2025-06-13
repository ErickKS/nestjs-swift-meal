import { Order } from '../order'
import { OrderStatus } from './order-status'
import { OrderStatusCanceled } from './order-status-canceled'
import { OrderStatusPaid } from './order-status-paid'

export class OrderStatusPaymentPending implements OrderStatus {
  value(): string {
    return 'PAYMENT_PENDING'
  }

  pay(order: Order): void {
    order.changeStatus(new OrderStatusPaid())
  }

  prepare(order: Order): void {
    throw new Error('Cannot prepare before payment')
  }

  ready(order: Order): void {
    throw new Error('Order must be prepared before being ready')
  }

  complete(order: Order): void {
    throw new Error('Order not ready yet')
  }

  cancel(order: Order): void {
    order.changeStatus(new OrderStatusCanceled())
  }
}
