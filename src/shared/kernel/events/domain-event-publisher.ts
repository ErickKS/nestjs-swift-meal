import type { DomainEvent } from './domain-event'
import type { EventTypes } from './events'

export type Subscriber<T extends DomainEvent<any>> = (event: T) => Promise<void>

class ExtendedSet<T> extends Set<T> {}

export class DomainEventPublisher {
  private static _instance: DomainEventPublisher
  private readonly subscribers: Map<string, ExtendedSet<Subscriber<DomainEvent<any>>>>

  private constructor() {
    this.subscribers = new Map()
  }

  static get instance(): DomainEventPublisher {
    if (!this._instance) {
      this._instance = new DomainEventPublisher()
    }
    return this._instance
  }

  public subscribe<T extends DomainEvent<any>>(event: EventTypes, subscriber: Subscriber<T>): void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new ExtendedSet())
    }
    this.subscribers.get(event)?.add(subscriber as Subscriber<DomainEvent<any>>)
  }

  public unsubscribe<T extends DomainEvent<any>>(event: EventTypes, subscriber: Subscriber<T>): void {
    const subscribers = this.subscribers.get(event)
    if (!subscribers) return
    subscribers.delete(subscriber as Subscriber<DomainEvent<any>>)
  }

  public publish<T>(event: DomainEvent<T>): void {
    const subscribers = this.subscribers.get(event.eventName)
    if (!subscribers) return
    for (const subscriber of subscribers) {
      subscriber(event as any)
    }
  }

  public publishAggregateEvents(aggregate: { domainEvents: DomainEvent<any>[], clearEvents: () => void }): void {
    for (const event of aggregate.domainEvents) {
      this.publish(event)
    }
    aggregate.clearEvents()
  }
}
