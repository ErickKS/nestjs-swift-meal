import { OrderStatus } from './order-status'
import { OrderStatusCanceled } from './order-status-canceled'
import { OrderStatusCompleted } from './order-status-completed'
import { OrderStatusPaid } from './order-status-paid'
import { OrderStatusPaymentPending } from './order-status-payment-pending'
import { OrderStatusPreparing } from './order-status-preparing'
import { OrderStatusReady } from './order-status-ready'

export class OrderStatusFactory {
  static from(name: string): OrderStatus {
    switch (name) {
      case 'PAYMENT_PENDING':
        return new OrderStatusPaymentPending()
      case 'PAID':
        return new OrderStatusPaid()
      case 'preparing':
        return new OrderStatusPreparing()
      case 'ready':
        return new OrderStatusReady()
      case 'completed':
        return new OrderStatusCompleted()
      case 'canceled':
        return new OrderStatusCanceled()
      default:
        throw new Error(`Invalid order status: ${name}`)
    }
  }
}
