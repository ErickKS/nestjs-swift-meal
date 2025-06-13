import { makeCustomer } from 'test/factories/make-customer'
import { makeItem } from 'test/factories/make-item'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'

let orderRepository: InMemoryOrderRepository
let customerRepository: InMemoryCustomerRepository
let itemRepository: InMemoryItemRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    orderRepository = new InMemoryOrderRepository()
    customerRepository = new InMemoryCustomerRepository()
    itemRepository = new InMemoryItemRepository()
    sut = new CreateOrderUseCase(orderRepository, customerRepository, itemRepository)
  })

  it('should create an order', async () => {
    await customerRepository.save(makeCustomer({}, 'customer-1'))
    await itemRepository.save(makeItem({ name: 'Pizza', price: 30 }, 'item-1'))
    await itemRepository.save(makeItem({ name: 'Coca Cola', price: 5 }, 'item-2'))
    const input = {
      customerId: 'customer-1',
      items: [
        {
          itemId: 'item-1',
          quantity: 2,
        },
        {
          itemId: 'item-2',
          quantity: 1,
        },
      ],
    }
    const result = await sut.execute(input)
    expect(orderRepository.orders).toHaveLength(1)
    expect(result.order.id).toBeDefined()
    expect(result.order.code).toBeDefined()
    expect(result.order.customerId).toBe(input.customerId)
    expect(result.order.status).toBe('PAYMENT_PENDING')
    expect(result.order.total).toBe(65)
    expect(result.order.items).toHaveLength(2)
  })

  it('should create an order without customerId', async () => {
    await itemRepository.save(makeItem({ name: 'Pizza', price: 30 }, 'item-1'))
    await itemRepository.save(makeItem({ name: 'Coca Cola', price: 5 }, 'item-2'))
    const input = {
      items: [
        {
          itemId: 'item-1',
          quantity: 2,
        },
        {
          itemId: 'item-2',
          quantity: 1,
        },
      ],
    }
    const result = await sut.execute(input)
    expect(orderRepository.orders).toHaveLength(1)
    expect(result.order.id).toBeDefined()
    expect(result.order.code).toBeDefined()
    expect(result.order.customerId).toBe(null)
    expect(result.order.status).toBe('PAYMENT_PENDING')
    expect(result.order.total).toBe(65)
    expect(result.order.items).toHaveLength(2)
  })

  it('should throw if items is empty', async () => {
    const input = {
      items: [],
    }
    await expect(() => sut.execute(input)).rejects.toThrow('At least one item is required')
  })

  it('should throw if item does not exist', async () => {
    await customerRepository.save(makeCustomer({}, 'customer-1'))
    const input = {
      customerId: 'customer-1',
      items: [{ itemId: 'non-existent', quantity: 1 }],
    }
    await expect(() => sut.execute(input)).rejects.toThrow(`Item 'non-existent' does not exist`)
  })

  it('should throw if item is inactive', async () => {
    await customerRepository.save(makeCustomer({}, 'customer-1'))
    await itemRepository.save(makeItem({ name: 'Pizza', price: 30, active: false }, 'item-1'))
    const input = {
      customerId: 'customer-1',
      items: [{ itemId: 'item-1', quantity: 1 }],
    }
    await expect(() => sut.execute(input)).rejects.toThrow(`Item 'item-1' is not available`)
  })
})
