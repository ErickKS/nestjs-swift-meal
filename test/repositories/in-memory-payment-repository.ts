import { PaymentRepository } from '@/application/payment/repositories/payment-repository'
import { Payment } from '@/domain/payment/payment'

export class InMemoryPaymentRepository implements PaymentRepository {
  payments: Payment[] = []

  async findById(id: string): Promise<Payment | null> {
    return this.payments.find(payment => payment.id === id) || null
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    return this.payments.find(payment => payment.orderId === orderId) || null
  }

  async findByExternalId(externalId: string): Promise<Payment | null> {
    return this.payments.find(payment => payment.externalId === externalId) || null
  }

  async save(payment: Payment): Promise<void> {
    this.payments.push(payment)
  }

  async update(payment: Payment): Promise<void> {
    const index = this.payments.findIndex(i => i.id === payment.id)
    if (index !== -1) this.payments[index] = payment
  }
}
