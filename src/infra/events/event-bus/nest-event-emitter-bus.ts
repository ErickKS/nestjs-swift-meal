import { IntegrationEvent, IntegrationEventBus } from '@/shared/kernel/events/integration-event-bus'
import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class NestEventEmitterBus implements IntegrationEventBus {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async publish(event: IntegrationEvent): Promise<void> {
    this.eventEmitter.emit(event.eventName, event)
  }
}
