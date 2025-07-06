// import { OnPaymentUpdatedOrderSubscriber } from '@/application/order/subscribers/on-payment-updated'
import { OnOrderCreatedPaymentSubscriber } from '@/application/payment/subscribers/on-order-created'
import { OrderCreatedEvent } from '@/domain/order/events/order-created-event'
import { DomainEventPublisher } from '@/shared/kernel/events/domain-event-publisher'
import { EVENTS } from '@/shared/kernel/events/events'
// import { PaymentUpdatedEvent } from '@/domain/payment/events/payment-updated-event'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class EventDispatcherService implements OnModuleInit {
  constructor(
    private readonly onOrderCreatedPaymentSubscriber: OnOrderCreatedPaymentSubscriber,
    // private readonly onPaymentUpdateOrderSubscriber: OnPaymentUpdatedOrderSubscriber
  ) {}

  onModuleInit() {
    DomainEventPublisher.instance.subscribe<OrderCreatedEvent>(EVENTS.ORDER_CREATED, domainEvent =>
      this.onOrderCreatedPaymentSubscriber.handle(domainEvent)
    )
    // DomainEventPublisher.instance.subscribe<PaymentUpdatedEvent>(EVENTS.PAYMENT_UPDATED, domainEvent =>
    //   this.onPaymentUpdateOrderSubscriber.handle(domainEvent)
    // )
  }
}
