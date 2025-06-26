import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { AggregateRoot } from '../kernel/entities/aggregate-root'
import { DomainEvents } from '../kernel/events/domain-events'

@Injectable()
export class DomainEventDispatcher {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  dispatchEventsForAggregate(aggregate: AggregateRoot<unknown>) {
    DomainEvents.dispatchEventsForAggregate(aggregate, async event => {
      const eventName = event.constructor.name
      this.eventEmitter.emit(eventName, event)
    })
  }
}
