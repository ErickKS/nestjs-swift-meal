import { Payment } from '@/domain/payment/payment'
import {
  Prisma,
  Payment as PrismaPayment,
  PaymentStatus as PrismaPaymentStatus
} from '@prisma/client'

export class PrismaPaymentMapper {
  static toDomain(raw: PrismaPayment): Payment {
    return Payment.restore(
      {
        orderId: raw.orderId,
        status: raw.status as PrismaPaymentStatus,
        amount: raw.amount,
        qrCode: raw.qrCode,
        externalId: raw.externalId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    )
  }

  static toPrisma(payment: Payment): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status as PrismaPaymentStatus,
      amount: payment.amountInCents,
      qrCode: payment.qrCode,
      externalId: payment.externalId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
