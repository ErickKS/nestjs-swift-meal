import { Payment } from '@/domain/payment/payment'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { PaymentGateway } from '../gateways/payment-gateway'
import { PaymentRepository } from '../repositories/payment-repository'

interface CreatePaymentInput {
  orderId: string
  amount: number
}

interface CreatePaymentOutput {
  payment: Payment
}

@Injectable()
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentGateway: PaymentGateway
  ) {}

  @Span()
  async execute({ orderId, amount }: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const { qrCode, externalId, status } = await this.paymentGateway.createPIXPayment(orderId, amount)
    const payment = Payment.create({
      orderId,
      amount,
      qrCode,
      externalId,
      status: status,
    })
    await this.paymentRepository.save(payment)
    return {
      payment,
    }
  }
}
