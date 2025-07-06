import { Injectable } from '@nestjs/common'
import { CreatePaymentUseCase } from '../use-cases/create-payment'
import { OrderCreatedEvent } from '@/domain/order/events/order-created-event'

@Injectable()
export class OnOrderCreatedPaymentSubscriber {
  constructor(private readonly createPaymentUseCase: CreatePaymentUseCase) {}

  async handle(event: OrderCreatedEvent): Promise<void> {
    const input = {
      orderId: event.payload.orderId,
      amount: event.payload.total,
    }
    await this.createPaymentUseCase.execute(input)
  }
}
