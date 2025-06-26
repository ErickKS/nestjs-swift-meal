import { OrderCreatedDomainEvent } from '@/domain/order/events/order-created-event'
import { OrderCreatedIntegrationEvent } from '@/shared/events/order-created-integration-event'
import { IntegrationEventBus } from '@/shared/kernel/events/integration-event-bus'
import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

@Injectable()
export class OnOrderCreatedHandler {
  constructor(private readonly eventBus: IntegrationEventBus) {}

  @OnEvent(OrderCreatedDomainEvent.name)
  async handle(event: OrderCreatedDomainEvent) {
    const integrationEvent = new OrderCreatedIntegrationEvent(
      event.order.id,
      event.order.customerId,
      event.order.totalInCents,
      event.order.items.map(i => ({
        itemId: i.itemId,
        name: i.name,
        quantity: i.quantity,
        unitPrice: i.unitPriceInCents,
      })),
      event.ocurredAt.toISOString()
    )
    await this.eventBus.publish(integrationEvent)
  }
}
