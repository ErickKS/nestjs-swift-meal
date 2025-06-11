import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { FetchCustomersUseCase } from './fetch-customers'

let customerRepository: InMemoryCustomerRepository
let sut: FetchCustomersUseCase

describe('Fetch Customers Use Case', () => {
  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new FetchCustomersUseCase(customerRepository)
  })

  it('should filter customers by partial name', async () => {
    await customerRepository.save(makeCustomer({ name: 'Ana Costa' }))
    await customerRepository.save(makeCustomer({ name: 'Bruno Costa' }))
    await customerRepository.save(makeCustomer({ name: 'Carlos Silva' }))
    const result = await sut.execute({ name: 'Costa' })
    expect(result.data).toHaveLength(2)
    expect(result.data.every(c => c.name.includes('Costa'))).toBe(true)
  })

  it('should filter customers by document', async () => {
    await customerRepository.save(makeCustomer({ document: '12345678909' }))
    await customerRepository.save(makeCustomer({ document: '98765432100' }))
    const result = await sut.execute({ document: '98765432100' })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].document).toBe('98765432100')
  })

  it('should filter customers by email (exact match)', async () => {
    await customerRepository.save(makeCustomer({ email: 'joao@example.com' }))
    await customerRepository.save(makeCustomer({ email: 'maria@example.com' }))
    const result = await sut.execute({ email: 'joao@example.com' })
    expect(result.data).toHaveLength(1)
    expect(result.data[0].email).toBe('joao@example.com')
  })

  it('should paginate correctly with default values', async () => {
    for (let i = 1; i <= 12; i++) {
      await customerRepository.save(makeCustomer({ name: `Customer ${i}` }))
    }
    const result = await sut.execute({})
    expect(result.data).toHaveLength(10)
    expect(result.total).toBe(12)
    expect(result.page).toBe(1)
    expect(result.perPage).toBe(10)
    expect(result.totalPages).toBe(2)
  })

  it('should paginate correctly with custom page and perPage', async () => {
    for (let i = 0; i < 7; i++) {
      await customerRepository.save(makeCustomer({ name: `Customer ${i}` }))
    }
    const result = await sut.execute({ page: 2, perPage: 3 })
    expect(result.data).toHaveLength(3)
    expect(result.total).toBe(7)
    expect(result.page).toBe(2)
    expect(result.perPage).toBe(3)
    expect(result.totalPages).toBe(3)
  })

  it('should return empty data if no customer matches filters', async () => {
    await customerRepository.save(makeCustomer({ name: 'Lucas Lima' }))
    const result = await sut.execute({ name: 'Zé Ninguém' })
    expect(result.data).toHaveLength(0)
    expect(result.total).toBe(0)
    expect(result.totalPages).toBe(0)
  })

  it('should sort customers by name ASC', async () => {
    await customerRepository.save(makeCustomer({ name: 'Carlos' }))
    await customerRepository.save(makeCustomer({ name: 'Ana' }))
    await customerRepository.save(makeCustomer({ name: 'Bruno' }))
    const result = await sut.execute({ sortOrder: 'asc' })
    const names = result.data.map(c => c.name)
    expect(names).toEqual(['Ana', 'Bruno', 'Carlos'])
  })

  it('should sort customers by name DESC', async () => {
    await customerRepository.save(makeCustomer({ name: 'Carlos' }))
    await customerRepository.save(makeCustomer({ name: 'Ana' }))
    await customerRepository.save(makeCustomer({ name: 'Bruno' }))
    const result = await sut.execute({ sortOrder: 'desc' })
    const names = result.data.map(c => c.name)
    expect(names).toEqual(['Carlos', 'Bruno', 'Ana'])
  })
})
