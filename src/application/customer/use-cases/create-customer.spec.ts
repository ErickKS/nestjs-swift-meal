import { CreateCustomerUseCase } from '@/application/customer/use-cases/create-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'

let customerRepository: InMemoryCustomerRepository
let sut: CreateCustomerUseCase

describe('Create Customer Use Case', () => {
  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new CreateCustomerUseCase(customerRepository)
  })

  it('should create an customer', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      document: '27981718066',
    }
    await sut.execute(input)
    expect(customerRepository.customers).toHaveLength(1)
    expect(customerRepository.customers[0].name).toBe('John Doe')
    expect(customerRepository.customers[0].email).toBe('john.doe@email.com')
    expect(customerRepository.customers[0].document).toBe('27981718066')
  })

  it('should throw if a customer with the same document already exists', async () => {
    await customerRepository.save(makeCustomer({ document: '27981718066' }))
    const input = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      document: '27981718066',
    }
    await expect(sut.execute(input)).rejects.toThrowError('Customer with this document already exists')
  })

  it('should throw if a customer with the same email already exists', async () => {
    await customerRepository.save(makeCustomer({ email: 'john.doe@email.com' }))
    const input = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      document: '27981718066',
    }
    await expect(sut.execute(input)).rejects.toThrowError('Customer with this email already exists')
  })
})
