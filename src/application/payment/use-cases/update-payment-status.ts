import { PaymentStatus } from '@/domain/payment/value-objects/payment-status'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { DomainEventPublisher } from '@/shared/kernel/events/domain-event-publisher'
import { Injectable } from '@nestjs/common'
import { PaymentRepository } from '../repositories/payment-repository'

interface UpdatePaymentStatusInput {
  externalId: string
  status: PaymentStatus
}

@Injectable()
export class UpdatePaymentStatusUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  @Span(({ externalId }) => ({ attributes: { externalId } }))
  async execute({ externalId, status }: UpdatePaymentStatusInput): Promise<void> {
    const payment = await this.paymentRepository.findByExternalId(externalId)
    if (!payment) throw new Error('Payment not found')
    payment.updateStatus(status)
    await this.paymentRepository.update(payment)
    DomainEventPublisher.instance.publishAggregateEvents(payment)
  }
}
