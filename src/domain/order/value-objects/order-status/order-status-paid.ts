import { Order } from '../../order'
import { OrderStatus, OrderStatusEnum } from './order-status'
import { OrderStatusCanceled } from './order-status-canceled'
import { OrderStatusPreparing } from './order-status-preparing'

export class OrderStatusPaid implements OrderStatus {
  value(): string {
    return OrderStatusEnum.PAID
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
    order.changeStatus(new OrderStatusCanceled())
  }
}
