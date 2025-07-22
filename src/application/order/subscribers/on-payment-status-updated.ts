import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { PaymentStatusUpdatedEvent } from '@/domain/payment/events/payment-status-updated-event'
import { PaymentStatusEnum } from '@/domain/payment/value-objects/payment-status'
import { Injectable } from '@nestjs/common'
import { UpdateOrderStatusUseCase } from '../use-cases/update-order-status'

@Injectable()
export class OnPaymentStatusUpdatedOrderSubscriber {
  constructor(private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase) {}

  async handle(event: PaymentStatusUpdatedEvent): Promise<void> {
    const orderStatus = this.mapPaymentToOrderStatus(event.payload.status)
    if (!orderStatus) return
    const input = {
      orderId: event.payload.orderId,
      status: orderStatus,
    }
    await this.updateOrderStatusUseCase.execute(input)
  }

  private mapPaymentToOrderStatus(paymentStatus: PaymentStatusEnum): OrderStatusEnum | null {
    switch (paymentStatus) {
      case PaymentStatusEnum.APPROVED:
        return OrderStatusEnum.PAID
      case PaymentStatusEnum.FAILED:
      case PaymentStatusEnum.REFUNDED:
        return OrderStatusEnum.CANCELED
      case PaymentStatusEnum.PENDING:
        return null
      default:
        return null
    }
  }
}
