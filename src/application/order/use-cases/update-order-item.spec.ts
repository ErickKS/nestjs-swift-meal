import { OrderItemStatusEnum } from '@/domain/order/value-objects/order-item'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UpdateOrderItemUseCase } from './update-order-item'

let orderRepository: InMemoryOrderRepository
let sut: UpdateOrderItemUseCase

describe('Update Order Item Use Case', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new UpdateOrderItemUseCase(orderRepository)
  })

  it('should update order item quantity and status', async () => {
    const order = makeOrder(
      {
        items: [
          {
            itemId: 'item-001',
            name: 'Item 1',
            quantity: 3,
            unitPriceDecimal: 10,
          },
          {
            itemId: 'item-002',
            name: 'Item 1',
            quantity: 1,
            unitPriceDecimal: 10,
          },
        ],
      },
      'order-1'
    )
    await orderRepository.save(order)
    await sut.execute({ orderId: 'order-1', itemId: 'item-001', quantity: 2 })
    await sut.execute({ orderId: 'order-1', itemId: 'item-002', status: OrderItemStatusEnum.CANCELED })
    const updatedOrder = await orderRepository.findById('order-1')
    expect(updatedOrder?.totalInDecimal).toBe(20)
    expect(updatedOrder?.items.find(el => el.itemId === 'item-002')?.status).toBe(OrderItemStatusEnum.CANCELED)
  })

  it('should throw error if order does not exist', async () => {
    await expect(() => sut.execute({ orderId: 'non-existent', itemId: 'item-002', quantity: 2 })).rejects.toThrowError('Order not found')
  })

  it('should throw error if order item does not exist', async () => {
    const order = makeOrder(
      {
        items: [
          {
            itemId: 'item-001',
            name: 'Item 1',
            quantity: 3,
            unitPriceDecimal: 10,
          },
        ],
      },
      'order-1'
    )
    await orderRepository.save(order)
    await expect(() => sut.execute({ orderId: 'order-1', itemId: 'non-existent', quantity: 2 })).rejects.toThrowError('Item not found')
  })

  it('should throw if neither quantity nor status is provided to update an order item', async () => {
    const order = makeOrder(
      {
        items: [
          {
            itemId: 'item-001',
            name: 'Item 1',
            quantity: 3,
            unitPriceDecimal: 10,
          },
        ],
      },
      'order-1'
    )
    await orderRepository.save(order)
    await expect(() => sut.execute({ orderId: 'order-1', itemId: 'item-001' })).rejects.toThrowError(
      'At least one property (quantity or status) must be provided to update the item'
    )
  })
})
