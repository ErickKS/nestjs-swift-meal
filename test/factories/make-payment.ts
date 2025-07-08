import { CreatePaymentProps, Payment } from '@/domain/payment/payment'
import { PrismaPaymentMapper } from '@/infra/database/prisma/mappers/prisma-payment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { makeOrder } from './make-order'

export function makePayment(override: Partial<CreatePaymentProps> = {}, id?: string) {
  const order = makeOrder({}, override.orderId)
  const payment = Payment.create({ orderId: order.id, amount: order.totalInCents }, id)
  return payment
}

@Injectable()
export class PaymentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaPayment(data: Partial<CreatePaymentProps> = {}): Promise<Payment> {
    const payment = makePayment(data)
    await this.prisma.payment.create({
      data: PrismaPaymentMapper.toPrisma(payment),
    })
    return payment
  }
}
