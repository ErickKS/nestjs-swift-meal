import { randomUUID } from 'node:crypto'
import { Order } from './order'
import { OrderItem } from './value-objects/order-item'
import { OrderStatusEnum } from './value-objects/order-status/order-status'

const makeItem = () =>
  OrderItem.create({
    itemId: 'prod-001',
    name: 'Coca-Cola',
    unitPrice: 5,
    quantity: 2,
  })

const makeAnotherItem = () =>
  OrderItem.create({
    itemId: 'prod-002',
    name: 'Pizza',
    unitPrice: 8,
    quantity: 1,
  })

const makeValidProps = () => ({
  customerId: randomUUID(),
  items: [makeItem()],
})

describe('Order Entity', () => {
  it('should create an order with valid properties', () => {
    const props = makeValidProps()
    const order = Order.create(props)
    expect(order.customerId).toBe(props.customerId)
    expect(order.code).toBeDefined()
    expect(order.status).toBe(OrderStatusEnum.PAYMENT_PENDING)
    expect(order.total).toBe(10)
    expect(order.createdAt).toBeInstanceOf(Date)
    expect(order.updatedAt).toBeInstanceOf(Date)
  })

  it('should transition from PAYMENT_PENDING → PAID → PREPARING → READY → COMPLETED', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    expect(order.status).toBe(OrderStatusEnum.PAID)
    order.prepare()
    expect(order.status).toBe(OrderStatusEnum.PREPARING)
    order.ready()
    expect(order.status).toBe(OrderStatusEnum.READY)
    order.complete()
    expect(order.status).toBe(OrderStatusEnum.COMPLETED)
  })

  it('should cancel a PAYMENT_PENDING order', () => {
    const order = Order.create(makeValidProps())
    order.cancel()
    expect(order.status).toBe(OrderStatusEnum.CANCELED)
  })

  it('should cancel a PAID order', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    order.cancel()
    expect(order.status).toBe(OrderStatusEnum.CANCELED)
  })

  it('should not allow paying twice', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    expect(() => order.pay()).toThrowError('Order already paid')
  })

  it('should not allow preparing before payment', () => {
    const order = Order.create(makeValidProps())
    expect(() => order.prepare()).toThrowError('Cannot prepare before payment')
  })

  it('should not allow paying a READY order', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    order.prepare()
    order.ready()
    expect(() => order.pay()).toThrowError('Order already paid')
  })

  it('should not allow canceling a COMPLETED order', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    order.prepare()
    order.ready()
    order.complete()
    expect(() => order.cancel()).toThrowError('Cannot cancel a completed order')
  })

  it('should not allow preparing a COMPLETED order', () => {
    const order = Order.create(makeValidProps())
    order.pay()
    order.prepare()
    order.ready()
    order.complete()
    expect(() => order.prepare()).toThrowError('Order already completed')
  })

  it('should not allow transitioning from CANCELED to READY', () => {
    const order = Order.create(makeValidProps())
    order.cancel()

    expect(() => order.ready()).toThrowError('Order was canceled')
  })

  it('should start with expected items and total', () => {
    const props = makeValidProps()
    const order = Order.create(props)
    expect(order.items).toHaveLength(1)
    expect(order.total).toBe(10)
  })

  it('should add a new item and recalculate total', () => {
    const order = Order.create(makeValidProps())
    const another = makeAnotherItem()
    order.addItem(another)
    expect(order.items).toHaveLength(2)
    expect(order.total).toBe(18)
  })

  it('should accumulate quantity if same product is added again', () => {
    const order = Order.create(makeValidProps())
    const duplicated = makeItem()
    order.addItem(duplicated)
    expect(order.items).toHaveLength(1)
    expect(order.items[0].quantity).toBe(4)
    expect(order.total).toBe(20)
  })

  it('should remove item by itemId and recalculate total', () => {
    const props = {
      customerId: randomUUID(),
      items: [makeItem(), makeAnotherItem()],
    }
    const order = Order.create(props)
    order.removeItem('prod-001')
    expect(order.items).toHaveLength(1)
    expect(order.items[0].itemId).toBe('prod-002')
    expect(order.total).toBe(8)
  })

  it('should throw if trying to remove a non-existing item', () => {
    const order = Order.create(makeValidProps())
    expect(() => order.removeItem('not-exists')).toThrowError('Item not found')
  })
})
