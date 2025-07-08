import { Payment } from '@/domain/payment/payment'

export class PaymentPresenter {
  static toHTTP(payment: Payment) {
    return {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      amount: payment.amountInDecimal,
      qrCode: payment.qrCode,
      externalId: payment.externalId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
