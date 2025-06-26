export interface IntegrationEvent {
  eventName: string
}

export abstract class IntegrationEventBus {
  abstract publish(event: IntegrationEvent): Promise<void>
}
