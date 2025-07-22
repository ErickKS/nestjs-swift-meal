import { PaymentStatus, PaymentStatusEnum } from '@/domain/payment/value-objects/payment-status'
import { makePayment } from 'test/factories/make-payment'
import { InMemoryPaymentRepository } from 'test/repositories/in-memory-payment-repository'
import { UpdatePaymentStatusUseCase } from './update-payment-status'

let paymentRepository: InMemoryPaymentRepository
let sut: UpdatePaymentStatusUseCase

describe('Update Payment Status Use Case', () => {
  beforeEach(() => {
    paymentRepository = new InMemoryPaymentRepository()
    sut = new UpdatePaymentStatusUseCase(paymentRepository)
  })

  it('should update payment status from PENDING -> APPROVED -> REFUNDED', async () => {
    const payment = makePayment({ status: PaymentStatusEnum.PENDING }, 'payment-1')
    await paymentRepository.save(payment)

    await sut.execute({ externalId: payment.externalId, status: PaymentStatus.approved() })
    const updated1 = await paymentRepository.findByExternalId(payment.externalId)
    expect(updated1?.status).toBe(PaymentStatusEnum.APPROVED)

    await sut.execute({ externalId: payment.externalId, status: PaymentStatus.refunded() })
    const updated2 = await paymentRepository.findByExternalId(payment.externalId)
    expect(updated2?.status).toBe(PaymentStatusEnum.REFUNDED)
  })

  it('should throw if payment does not exist', async () => {
    await expect(() => sut.execute({ externalId: 'invalid-id', status: PaymentStatus.approved() })).rejects.toThrowError(
      'Payment not found'
    )
  })

  it('should allow status overwrite regardless of current status', async () => {
    const payment = makePayment({ status: PaymentStatusEnum.FAILED }, 'payment-2')
    await paymentRepository.save(payment)

    await sut.execute({ externalId: payment.externalId, status: PaymentStatus.pending() })
    const updated = await paymentRepository.findByExternalId(payment.externalId)
    expect(updated?.status).toBe(PaymentStatusEnum.PENDING)
  })
})
