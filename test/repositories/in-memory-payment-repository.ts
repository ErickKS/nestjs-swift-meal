import { PaymentRepository } from '@/application/payment/repositories/payment-repository'
import { Payment } from '@/domain/payment/payment'

export class InMemoryPaymentRepository implements PaymentRepository {
  payments: Payment[] = []

  async findById(id: string): Promise<Payment | null> {
    return this.payments.find(payment => payment.id === id) || null
  }

  async save(payment: Payment): Promise<void> {
    this.payments.push(payment)
  }
}
