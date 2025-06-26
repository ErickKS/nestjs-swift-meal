import { EventEmitter2 } from '@nestjs/event-emitter'
import { AggregateRoot } from '../kernel/entities/aggregate-root'
import { DomainEvent } from '../kernel/events/domain-event'
import { DomainEvents } from '../kernel/events/domain-events'
import { UniqueEntityID } from '../kernel/value-objects/unique-entity-id'
import { DomainEventDispatcher } from './domain-event-dispatcher'

class FakeAggregateCreatedEvent implements DomainEvent {
  ocurredAt = new Date()
  constructor(readonly aggregateId: string) {}
  getAggregateId(): string {
    return this.aggregateId
  }
}

class FakeAggregate extends AggregateRoot<null> {
  static create(id: string) {
    const aggregate = new FakeAggregate(null, UniqueEntityID.create(id))
    aggregate.addDomainEvent(new FakeAggregateCreatedEvent(id))
    return aggregate
  }
}

describe('DomainEventDispatcher', () => {
  let emitter: EventEmitter2
  let dispatcher: DomainEventDispatcher
  let spyEmit: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    emitter = new EventEmitter2()
    spyEmit = vi.spyOn(emitter, 'emit')
    dispatcher = new DomainEventDispatcher(emitter)
  })

  afterEach(() => {
    spyEmit.mockRestore()
    DomainEvents.clearMarkedAggregates()
  })

  it('should must emit all Domain Events stored in the aggregate', () => {
    const aggregate = FakeAggregate.create('agg-1')
    dispatcher.dispatchEventsForAggregate(aggregate)
    expect(spyEmit).toHaveBeenCalledTimes(1)
    const [eventName, eventInstance] = spyEmit.mock.calls[0] as [string, FakeAggregateCreatedEvent]
    expect(eventName).toBe(FakeAggregateCreatedEvent.name)
    expect(eventInstance).toBeInstanceOf(FakeAggregateCreatedEvent)
    expect(eventInstance.getAggregateId()).toBe('agg-1')
  })
})
