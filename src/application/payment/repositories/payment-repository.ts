import { Payment } from '@/domain/payment/payment'

export abstract class PaymentRepository {
  abstract findById(id: string): Promise<Payment | null>
  abstract findByOrderId(orderId: string): Promise<Payment | null>
  abstract save(payment: Payment): Promise<void>
}
