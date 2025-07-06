import { DomainEvent } from './domain-event'
import { DomainEventPublisher } from './domain-event-publisher'
import { EVENTS } from './events'

interface FakeOrderCreatedEventProps {
  orderId: string
}

class FakeOrderCreatedEvent extends DomainEvent<FakeOrderCreatedEventProps> {
  payload: FakeOrderCreatedEventProps

  constructor(props: FakeOrderCreatedEventProps) {
    super(EVENTS.ORDER_CREATED)
    this.payload = props
  }
}

interface FakePaymentUpdatedEventProps {
  paymentId: string
}

class FakePaymentUpdatedEvent extends DomainEvent<FakePaymentUpdatedEventProps> {
  payload: FakePaymentUpdatedEventProps

  constructor(props: FakePaymentUpdatedEventProps) {
    super(EVENTS.PAYMENT_UPDATED)
    this.payload = props
  }
}

describe('DomainEventPublisher', () => {
  beforeEach(() => {
    DomainEventPublisher.instance['subscribers'].clear()
  })

  it('should publish an event', () => {
    const event = new FakeOrderCreatedEvent({ orderId: 'order-1' })
    const subscriber = vi.fn()
    DomainEventPublisher.instance.subscribe('order.created', subscriber)
    DomainEventPublisher.instance.publish(event)
    expect(subscriber).toHaveBeenCalledWith(event)
  })

  it('should unsubscribe an event', () => {
    const subscriber = vi.fn()
    DomainEventPublisher.instance.subscribe('order.created', subscriber)
    DomainEventPublisher.instance.unsubscribe('order.created', subscriber)
  })

  it('should notify one subscriber per topic', () => {
    const OrderCreatedEvent = new FakeOrderCreatedEvent({ orderId: 'order-1' })
    const paymentApprovedEvent = new FakePaymentUpdatedEvent({ paymentId: 'payment-1' })
    const subscriber1 = vi.fn()
    const subscriber2 = vi.fn()
    DomainEventPublisher.instance.subscribe('order.created', subscriber1)
    DomainEventPublisher.instance.subscribe('payment.updated', subscriber2)
    expect(DomainEventPublisher.instance['subscribers'].size).toBe(2)
    DomainEventPublisher.instance.publish(OrderCreatedEvent)
    DomainEventPublisher.instance.publish(paymentApprovedEvent)
    expect(subscriber1).toHaveBeenCalledWith(OrderCreatedEvent)
    expect(subscriber1).toHaveBeenCalledTimes(1)
    expect(subscriber1).not.toHaveBeenCalledWith(paymentApprovedEvent)
    expect(subscriber2).toHaveBeenCalledWith(paymentApprovedEvent)
    expect(subscriber2).toHaveBeenCalledTimes(1)
    expect(subscriber2).not.toHaveBeenCalledWith(OrderCreatedEvent)
  })
})
