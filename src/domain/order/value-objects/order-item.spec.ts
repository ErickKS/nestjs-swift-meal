import { describe, expect, it } from 'vitest'
import { OrderItem } from './order-item'

describe('OrderItem Value Object', () => {
  const makeValidProps = () => ({
    itemId: 'prod-123',
    name: 'Pizza Margherita',
    unitPriceDecimal: 29.9,
    quantity: 2,
  })

  it('should create a valid order item', () => {
    const item = OrderItem.create(makeValidProps())
    expect(item.itemId).toBe('prod-123')
    expect(item.name).toBe('Pizza Margherita')
    expect(item.unitPriceInDecimal).toBe(29.9)
    expect(item.unitPriceInCents).toBe(2990)
    expect(item.quantity).toBe(2)
    expect(item.subtotalInDecimal).toBe(59.8)
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
    expect(updated.subtotalInDecimal).toBeCloseTo(149.5)
  })

  it('should decrease quantity immutably', () => {
    const item = OrderItem.create(makeValidProps())
    const updated = item.decreaseQuantity(1)
    expect(item.quantity).toBe(2)
    expect(updated.quantity).toBe(1)
    expect(updated.subtotalInDecimal).toBeCloseTo(29.9)
  })

  it('should throw if decrease results in quantity <= 0', () => {
    const item = OrderItem.create(makeValidProps())
    expect(() => item.decreaseQuantity(2)).toThrowError('Quantity must be greater than 0 after decrement')
    expect(() => item.decreaseQuantity(3)).toThrowError('Quantity must be greater than 0 after decrement')
  })

  it('should restore successfully from raw props', () => {
    const item = OrderItem.restore({
      itemId: 'prod-123',
      name: 'Pizza Margherita',
      unitPriceCents: 2990,
      quantity: 2,
    })
    expect(item.itemId).toBe('prod-123')
    expect(item.name).toBe('Pizza Margherita')
    expect(item.unitPriceInDecimal).toBe(29.9)
    expect(item.unitPriceInCents).toBe(2990)
    expect(item.quantity).toBe(2)
  })
})
