import { Payment } from '@/domain/payment/payment'

export class PaymentPresenter {
  static toHTTP(payment: Payment) {
    return {
      status: payment.status,
      amount: payment.amountInDecimal,
      qrCode: payment.qrCode,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
