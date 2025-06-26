import { DomainEventDispatcher } from '@/shared/events/domain-event-dispatcher'
import { IntegrationEventBus } from '@/shared/kernel/events/integration-event-bus'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { NestEventEmitterBus } from './event-bus/nest-event-emitter-bus'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    DomainEventDispatcher,
    {
      provide: IntegrationEventBus,
      useClass: NestEventEmitterBus,
    },
  ],
  exports: [DomainEventDispatcher, IntegrationEventBus],
})
export class EventModule {}
