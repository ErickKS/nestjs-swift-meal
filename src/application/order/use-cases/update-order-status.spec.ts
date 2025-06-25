import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { UpdateOrderStatusUseCase } from './update-order-status'

let orderRepository: InMemoryOrderRepository
let sut: UpdateOrderStatusUseCase

describe('Update Order Status Use Case', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new UpdateOrderStatusUseCase(orderRepository)
  })

  it('should update order status from PAYMENT_PENDING -> PAID -> PREPARING', async () => {
    const order = makeOrder({ status: OrderStatusEnum.PAYMENT_PENDING }, 'order-1')
    await orderRepository.save(order)
    await sut.execute({ orderId: 'order-1', status: OrderStatusEnum.PAID })
    const updated1 = await orderRepository.findById('order-1')
    expect(updated1?.status).toBe(OrderStatusEnum.PAID)
    await sut.execute({ orderId: 'order-1', status: OrderStatusEnum.PREPARING })
    const updated2 = await orderRepository.findById('order-1')
    expect(updated2?.status).toBe(OrderStatusEnum.PREPARING)
  })

  it('should throw error if order does not exist', async () => {
    await expect(() => sut.execute({ orderId: 'non-existent', status: OrderStatusEnum.PAID })).rejects.toThrowError('Order not found')
  })

  it('should throw error for invalid transition', async () => {
    const order = makeOrder({ status: OrderStatusEnum.COMPLETED }, 'order-3')
    await orderRepository.save(order)
    await expect(() => sut.execute({ orderId: 'order-3', status: OrderStatusEnum.PAID })).rejects.toThrowError()
  })
})
