import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchOrdersUseCase } from './fetch-orders'

let orderRepository: InMemoryOrderRepository
let sut: FetchOrdersUseCase

describe('Fetch Orders Use Case', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    sut = new FetchOrdersUseCase(orderRepository)
  })

  it('should filter orders by exact code', async () => {
    await orderRepository.save(makeOrder({ code: 'ORDER-001' }))
    await orderRepository.save(makeOrder({ code: 'ORDER-002' }))
    const result = await sut.execute({ code: 'ORDER-001' })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].code).toBe('ORDER-001')
  })

  it('should filter orders by status', async () => {
    await orderRepository.save(makeOrder({ status: OrderStatusEnum.PAID }))
    await orderRepository.save(makeOrder({ status: OrderStatusEnum.CANCELED }))
    await orderRepository.save(makeOrder({ status: OrderStatusEnum.PAID }))
    const result = await sut.execute({ status: OrderStatusEnum.PAID })
    expect(result.data).toHaveLength(2)
    expect(result.data.every(o => o.status === OrderStatusEnum.PAID)).toBe(true)
  })

  it('should paginate correctly', async () => {
    for (let i = 0; i < 25; i++) {
      await orderRepository.save(makeOrder())
    }
    const page1 = await sut.execute({ page: 1, perPage: 10 })
    const page2 = await sut.execute({ page: 2, perPage: 10 })
    const page3 = await sut.execute({ page: 3, perPage: 10 })
    expect(page1.data).toHaveLength(10)
    expect(page2.data).toHaveLength(10)
    expect(page3.data).toHaveLength(5)
  })

  it('should sort orders by createdAt ascending', async () => {
    const now = new Date()
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime() + 1000) }))
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime() + 2000) }))
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime()) }))
    const result = await sut.execute({ sortOrder: 'asc' })
    const times = result.data.map(o => o.createdAt.getTime())
    expect(times).toEqual([...times].sort((a, b) => a - b))
  })

  it('should sort orders by createdAt descending', async () => {
    const now = new Date()
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime()) }))
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime() + 2000) }))
    await orderRepository.save(makeOrder({ createdAt: new Date(now.getTime() + 1000) }))
    const result = await sut.execute({ sortOrder: 'desc' })
    const times = result.data.map(o => o.createdAt.getTime())
    expect(times).toEqual([...times].sort((a, b) => b - a))
  })

  it('should return correct pagination metadata', async () => {
    for (let i = 0; i < 7; i++) {
      await orderRepository.save(makeOrder())
    }
    const result = await sut.execute({ page: 2, perPage: 3 })
    expect(result.total).toBe(7)
    expect(result.page).toBe(2)
    expect(result.perPage).toBe(3)
    expect(result.totalPages).toBe(3)
    expect(result.data).toHaveLength(3)
  })
})
