import { randomUUID } from 'node:crypto'
import { EventTypes } from './events'

export abstract class DomainEvent<T> {
  readonly id: string
  readonly eventName: EventTypes
  readonly occurredAt: Date
  abstract readonly payload: T

  constructor(eventName: EventTypes) {
    this.id = randomUUID()
    this.eventName = eventName
    this.occurredAt = new Date()
  }
}
