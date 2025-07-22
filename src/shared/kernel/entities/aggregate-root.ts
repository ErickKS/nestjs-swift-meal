import { DomainEvent } from '../events/domain-event'
import { Entity } from './entity'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent<any>[] = []

  get domainEvents(): DomainEvent<any>[] {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent<any>): void {
    this._domainEvents.push(domainEvent)
  }

  public clearEvents() {
    this._domainEvents = []
  }
}
