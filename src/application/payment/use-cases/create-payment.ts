import { Payment } from '@/domain/payment/payment'
import { Injectable } from '@nestjs/common'
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
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const payment = Payment.create(input)
    await this.paymentRepository.save(payment)
    return {
      payment,
    }
  }
}
