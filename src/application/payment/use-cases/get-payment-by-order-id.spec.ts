import { makePayment } from 'test/factories/make-payment'
import { InMemoryPaymentRepository } from 'test/repositories/in-memory-payment-repository'
import { GetPaymentByOrderIdUseCase } from './get-payment-by-order-id'

let paymentRepository: InMemoryPaymentRepository
let sut: GetPaymentByOrderIdUseCase

describe('Get Payment By Id Use Case', () => {
  beforeEach(() => {
    paymentRepository = new InMemoryPaymentRepository()
    sut = new GetPaymentByOrderIdUseCase(paymentRepository)
  })

  it('should return the payment if it exists', async () => {
    const payment = makePayment({ orderId: 'order-1' }, 'payment-1')
    await paymentRepository.save(payment)
    const result = await sut.execute({ orderId: 'order-1' })
    expect(result.payment).toEqual(payment)
  })

  it('should throw if payment does not exist', async () => {
    await expect(() => sut.execute({ orderId: 'non-existent-id' })).rejects.toThrowError('Payment not found')
  })
})
