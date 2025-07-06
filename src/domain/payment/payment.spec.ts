import { randomInt, randomUUID } from 'node:crypto'
import { CreatePaymentProps, Payment, PaymentStatusEnum } from './payment'

function makeValidPaymentProps(override?: Partial<CreatePaymentProps>): CreatePaymentProps {
  return {
    orderId: randomUUID(),
    externalId: String(randomInt(1, 10)),
    amount: randomInt(1, 100),
    qrCode: 'asdQWE123',
    status: PaymentStatusEnum.PENDING,
    ...override,
  }
}

describe('Payment Entity', () => {
  it('should create an payment with valid properties', () => {
    const props = makeValidPaymentProps({ amount: 1000 })
    const payment = Payment.create(props)
    expect(payment.orderId).toBe(props.orderId)
    expect(payment.externalId).toBe(props.externalId)
    expect(payment.status).toBe(PaymentStatusEnum.PENDING)
    expect(payment.amountInDecimal).toBe(10)
    expect(payment.amountInCents).toBe(1000)
    expect(payment.createdAt).toBeInstanceOf(Date)
    expect(payment.updatedAt).toBeInstanceOf(Date)
  })

  it('should restore an payment', () => {
    const props = {
      orderId: 'order-1',
      externalId: '123',
      amount: 1000,
      qrCode: 'asdQWE123',
      status: PaymentStatusEnum.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const payment = Payment.restore(props, 'payment-1')
    expect(payment.orderId).toBe(props.orderId)
    expect(payment.externalId).toBe(props.externalId)
    expect(payment.status).toBe(PaymentStatusEnum.APPROVED)
    expect(payment.amountInDecimal).toBe(10)
    expect(payment.amountInCents).toBe(1000)
    expect(payment.createdAt).toBeInstanceOf(Date)
    expect(payment.updatedAt).toBeInstanceOf(Date)
  })
})
