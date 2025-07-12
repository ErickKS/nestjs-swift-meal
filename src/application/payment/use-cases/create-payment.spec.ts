import { randomUUID } from 'node:crypto'
import { PaymentStatusEnum } from '@/domain/payment/value-objects/payment-status'
import { FakePaymentGateway } from 'test/gateways/payment.gateway'
import { InMemoryPaymentRepository } from 'test/repositories/in-memory-payment-repository'
import { CreatePaymentUseCase } from './create-payment'

let paymentRepository: InMemoryPaymentRepository
let paymentGateway: FakePaymentGateway
let sut: CreatePaymentUseCase

describe('Create Payment Use Case', () => {
  beforeEach(() => {
    paymentRepository = new InMemoryPaymentRepository()
    paymentGateway = new FakePaymentGateway()
    sut = new CreatePaymentUseCase(paymentRepository, paymentGateway)
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
    expect(result.payment.amountInCents).toBe(100)
    expect(result.payment.qrCode).toBeDefined()
    expect(result.payment.externalId).toBeDefined()
  })
})
