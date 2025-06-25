import { OrderStatus, OrderStatusEnum } from '../value-objects/order-status/order-status'
import { OrderStatusCanceled } from '../value-objects/order-status/order-status-canceled'
import { OrderStatusCompleted } from '../value-objects/order-status/order-status-completed'
import { OrderStatusPaid } from '../value-objects/order-status/order-status-paid'
import { OrderStatusPaymentPending } from '../value-objects/order-status/order-status-payment-pending'
import { OrderStatusPreparing } from '../value-objects/order-status/order-status-preparing'
import { OrderStatusReady } from '../value-objects/order-status/order-status-ready'

export class OrderStatusFactory {
  static from(name: string): OrderStatus {
    switch (name) {
      case OrderStatusEnum.PAYMENT_PENDING:
        return new OrderStatusPaymentPending()
      case OrderStatusEnum.PAID:
        return new OrderStatusPaid()
      case OrderStatusEnum.PREPARING:
        return new OrderStatusPreparing()
      case OrderStatusEnum.READY:
        return new OrderStatusReady()
      case OrderStatusEnum.COMPLETED:
        return new OrderStatusCompleted()
      case OrderStatusEnum.CANCELED:
        return new OrderStatusCanceled()
      default:
        throw new Error(`Invalid order status: ${name}`)
    }
  }
}
