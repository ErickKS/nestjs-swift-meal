import { DomainEvent } from '@/shared/kernel/events/domain-event'
import { Order } from '../order'

export class OrderCreatedDomainEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.order = order
    this.ocurredAt = new Date()
  }

  getAggregateId(): string {
    return this.order.id
  }
}
