import { Payment } from '@/domain/payment/payment'
import { Injectable } from '@nestjs/common'
import { Span } from 'nestjs-otel'
import { PaymentRepository } from '../repositories/payment-repository'

interface GetPaymentByOrderIdInput {
  orderId: string
}

interface GetPaymentByOrderIdOutput {
  payment: Payment
}

@Injectable()
export class GetPaymentByOrderIdUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  @Span(({ orderId }) => ({ attributes: { orderId } }))
  async execute({ orderId }: GetPaymentByOrderIdInput): Promise<GetPaymentByOrderIdOutput> {
    const payment = await this.paymentRepository.findByOrderId(orderId)
    if (!payment) throw new Error('Payment not found')
    return {
      payment,
    }
  }
}
