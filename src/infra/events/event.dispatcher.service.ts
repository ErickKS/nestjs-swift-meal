import { OnPaymentStatusUpdatedOrderSubscriber } from '@/application/order/subscribers/on-payment-status-updated'
import { OnOrderCreatedPaymentSubscriber } from '@/application/payment/subscribers/on-order-created'
import { OrderCreatedEvent } from '@/domain/order/events/order-created-event'
import { PaymentStatusUpdatedEvent } from '@/domain/payment/events/payment-status-updated-event'
import { DomainEventPublisher } from '@/shared/kernel/events/domain-event-publisher'
import { EVENTS } from '@/shared/kernel/events/events'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class EventDispatcherService implements OnModuleInit {
  constructor(
    private readonly onOrderCreatedPaymentSubscriber: OnOrderCreatedPaymentSubscriber,
    private readonly onPaymentStatusUpdatedOrderSubscriber: OnPaymentStatusUpdatedOrderSubscriber
  ) {}

  onModuleInit() {
    DomainEventPublisher.instance.subscribe<OrderCreatedEvent>(EVENTS.ORDER_CREATED, domainEvent =>
      this.onOrderCreatedPaymentSubscriber.handle(domainEvent)
    )
    DomainEventPublisher.instance.subscribe<PaymentStatusUpdatedEvent>(EVENTS.PAYMENT_STATUS_UPDATED, domainEvent =>
      this.onPaymentStatusUpdatedOrderSubscriber.handle(domainEvent)
    )
  }
}
