import { describe, expect, it } from 'vitest'
import { OrderItem } from './order-item'

describe('OrderItem Value Object', () => {
  const makeValidProps = () => ({
    itemId: 'prod-123',
    name: 'Pizza Margherita',
    unitPrice: 29.9,
    quantity: 2,
  })

  it('should create a valid order item', () => {
    const props = makeValidProps()
    const item = OrderItem.create(props)
    expect(item.itemId).toBe(props.itemId)
    expect(item.name).toBe(props.name)
    expect(item.unitPrice).toBeCloseTo(props.unitPrice)
    expect(item.quantity).toBe(props.quantity)
    expect(item.subtotal).toBeCloseTo(59.8)
  })

  it('should throw if quantity is 0 or less', () => {
    const props = { ...makeValidProps(), quantity: 0 }
    expect(() => OrderItem.create(props)).toThrowError('Quantity must be greater than 0')
  })

  it('should increase quantity immutably', () => {
    const item = OrderItem.create(makeValidProps())
    const updated = item.increaseQuantity(3)
    expect(item.quantity).toBe(2)
    expect(updated.quantity).toBe(5)
    expect(updated.subtotal).toBeCloseTo(149.5)
  })

  it('should decrease quantity immutably', () => {
    const item = OrderItem.create(makeValidProps())
    const updated = item.decreaseQuantity(1)
    expect(item.quantity).toBe(2)
    expect(updated.quantity).toBe(1)
    expect(updated.subtotal).toBeCloseTo(29.9)
  })

  it('should throw if decrease results in quantity <= 0', () => {
    const item = OrderItem.create(makeValidProps())
    expect(() => item.decreaseQuantity(2)).toThrowError('Quantity must be greater than 0 after decrement')
    expect(() => item.decreaseQuantity(3)).toThrowError('Quantity must be greater than 0 after decrement')
  })

  it('should restore successfully from raw props', () => {
    const props = makeValidProps()
    const item = OrderItem.restore(props)
    expect(item.itemId).toBe(props.itemId)
    expect(item.name).toBe(props.name)
    expect(item.unitPrice).toBeCloseTo(props.unitPrice)
    expect(item.quantity).toBe(props.quantity)
  })
})
