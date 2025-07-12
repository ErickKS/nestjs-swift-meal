import { CreatePaymentProps, Payment } from '@/domain/payment/payment'
import { PrismaPaymentMapper } from '@/infra/database/prisma/mappers/prisma-payment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makePayment(override: Partial<CreatePaymentProps> = {}, id?: string) {
  const defaults: CreatePaymentProps = {
    orderId: override.orderId ?? 'order-1',
    externalId: override.externalId ?? '123',
    amount: override.amount ?? 1000,
    qrCode: override.qrCode ?? 'asdQWE123',
    status: override.status ?? 'PENDING',
    createdAt: override.createdAt ?? new Date(),
    updatedAt: override.updatedAt ?? new Date(),
  }
  const payment = Payment.create({ ...defaults, ...override }, id)
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
