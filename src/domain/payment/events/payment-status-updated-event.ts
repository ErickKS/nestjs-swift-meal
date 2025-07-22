import { DomainEvent } from '@/shared/kernel/events/domain-event'
import { EVENTS } from '@/shared/kernel/events/events'
import { PaymentStatusEnum } from '../value-objects/payment-status'

export interface PaymentStatusUpdatedEventProps {
  paymentId: string
  orderId: string
  status: PaymentStatusEnum
}

export class PaymentStatusUpdatedEvent extends DomainEvent<PaymentStatusUpdatedEventProps> {
  payload: PaymentStatusUpdatedEventProps

  constructor(props: PaymentStatusUpdatedEventProps) {
    super(EVENTS.PAYMENT_STATUS_UPDATED)
    this.payload = props
  }
}
