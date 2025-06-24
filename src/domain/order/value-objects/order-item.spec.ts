import { describe, expect, it } from 'vitest'
import { OrderItem, OrderItemStatusEnum } from './order-item'

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

  it('should restore successfully from raw props', () => {
    const item = OrderItem.restore({
      itemId: 'prod-123',
      name: 'Pizza Margherita',
      unitPriceCents: 2990,
      quantity: 2,
      status: 'ACTIVE',
    })
    expect(item.itemId).toBe('prod-123')
    expect(item.name).toBe('Pizza Margherita')
    expect(item.unitPriceInDecimal).toBe(29.9)
    expect(item.unitPriceInCents).toBe(2990)
    expect(item.quantity).toBe(2)
  })

  it('should throw if quantity is 0 or less', () => {
    const props = { ...makeValidProps(), quantity: 0 }
    expect(() => OrderItem.create(props)).toThrowError('Quantity must be greater than 0')
  })

  it('should update quantity immutably', () => {
    const originalItem = OrderItem.create(makeValidProps())
    const updatedItem = originalItem.updateQuantity(4)
    expect(originalItem).not.toBe(updatedItem)
    expect(originalItem.quantity).toBe(2)
    expect(updatedItem.quantity).toBe(4)
  })

  it('should update status immutably', () => {
    const originalItem = OrderItem.create(makeValidProps())
    const updatedItem = originalItem.updateStatus(OrderItemStatusEnum.CANCELED)
    expect(originalItem).not.toBe(updatedItem)
    expect(originalItem.status).toBe(OrderItemStatusEnum.ACTIVE)
    expect(updatedItem.status).toBe(OrderItemStatusEnum.CANCELED)
  })

  it('should throw when restoring with invalid status', () => {
    expect(() =>
      OrderItem.restore({
        itemId: 'prod-123',
        name: 'Pizza Margherita',
        unitPriceCents: 2990,
        quantity: 2,
        status: 'INVALID_STATUS',
      })
    ).toThrowError('Invalid order item status: INVALID_STATUS')
  })
})
