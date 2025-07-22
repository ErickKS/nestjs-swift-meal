import { Order } from '../../order'
import { OrderStatus, OrderStatusEnum } from './order-status'
import { OrderStatusCanceled } from './order-status-canceled'
import { OrderStatusPaid } from './order-status-paid'

export class OrderStatusPaymentPending implements OrderStatus {
  value(): string {
    return OrderStatusEnum.PAYMENT_PENDING
  }

  pay(order: Order): void {
    order.changeStatus(new OrderStatusPaid())
  }

  prepare(order: Order): void {
    throw new Error('Cannot prepare before payment')
  }

  ready(order: Order): void {
    throw new Error('Cannot mark order as ready before preparing it')
  }

  complete(order: Order): void {
    throw new Error('Order not ready yet')
  }

  cancel(order: Order): void {
    order.changeStatus(new OrderStatusCanceled())
  }
}
