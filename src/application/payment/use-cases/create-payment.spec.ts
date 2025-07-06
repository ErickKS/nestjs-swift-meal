import { randomUUID } from 'node:crypto'
import { PaymentStatusEnum } from '@/domain/payment/payment'
import { InMemoryPaymentRepository } from 'test/repositories/in-memory-payment-repository'
import { CreatePaymentUseCase } from './create-payment'

let paymentRepository: InMemoryPaymentRepository
let sut: CreatePaymentUseCase

describe('Create Payment Use Case', () => {
  beforeEach(() => {
    paymentRepository = new InMemoryPaymentRepository()
    sut = new CreatePaymentUseCase(paymentRepository)
  })

  it('should create an payment', async () => {
    const input = {
      orderId: randomUUID(),
      amount: 100,
    }
    const result = await sut.execute(input)
    expect(paymentRepository.payments).toHaveLength(1)
    expect(result.payment.id).toBeDefined()
    expect(result.payment.status).toBe(PaymentStatusEnum.PENDING)
    expect(result.payment.amount).toBe(100)
  })
})
