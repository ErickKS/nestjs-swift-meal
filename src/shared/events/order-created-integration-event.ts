export class OrderCreatedIntegrationEvent {
  public readonly eventName = 'integration.order.created'

  constructor(
    public readonly orderId: string,
    public readonly customerId: string | null,
    public readonly totalInCents: number,
    public readonly items: { itemId: string; name: string; quantity: number; unitPrice: number }[],
    public readonly createAt: string
  ) {}
}
