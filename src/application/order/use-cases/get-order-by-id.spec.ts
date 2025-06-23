import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { GetOrderByIdUseCase } from './get-order-by-id'

let orderRepository: InMemoryOrderRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id Use Case', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new GetOrderByIdUseCase(orderRepository)
  })

  it('should return the order if it exists', async () => {
    const order = makeOrder({}, 'order-1')
    await orderRepository.save(order)
    const result = await sut.execute({ orderId: 'order-1' })
    expect(result.order).toEqual(order)
    expect(result.order.id).toEqual('order-1')
  })

  it('should throw if order does not exist', async () => {
    await expect(() => sut.execute({ orderId: 'non-existent-id' })).rejects.toThrowError('Order not found')
  })
})
