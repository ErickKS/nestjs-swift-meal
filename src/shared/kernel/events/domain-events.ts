import { AggregateRoot } from '../entities/aggregate-root'
import { DomainEvent } from './domain-event'

export class DomainEvents {
  private static markedAggregates: AggregateRoot<unknown>[] = []

  public static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const found = !!this.findMarkedAggregateByID(aggregate.id)
    if (!found) this.markedAggregates.push(aggregate)
  }

  public static dispatchEventsForAggregate(aggregate: AggregateRoot<unknown>, dispatchFn: (event: DomainEvent) => Promise<void> | void) {
    for (const event of aggregate.domainEvents) {
      dispatchFn(event)
    }
    aggregate.clearEvents()
    this.removeAggregateFromMarkedDispatchList(aggregate)
  }

  public static findMarkedAggregateByID(id: string): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find(a => a.id === id)
  }

  public static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>) {
    const index = this.markedAggregates.findIndex(a => a.equals(aggregate))
    if (index !== -1) this.markedAggregates.splice(index, 1)
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = []
  }
}
