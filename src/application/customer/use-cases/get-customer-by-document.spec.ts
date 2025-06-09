import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomerRepository } from 'test/repositories/in-memory-customer-repository'
import { GetCustomerByDocumentUseCase } from './get-customer-by-document'

let customerRepository: InMemoryCustomerRepository
let sut: GetCustomerByDocumentUseCase

describe('Get Customer By Id Use Case', () => {
  beforeEach(() => {
    customerRepository = new InMemoryCustomerRepository()
    sut = new GetCustomerByDocumentUseCase(customerRepository)
  })

  it('should return the customer if it exists', async () => {
    const customer = makeCustomer({ document: '27981718066' })
    await customerRepository.save(customer)
    const result = await sut.execute({ document: '27981718066' })
    expect(result.customer).toEqual(customer)
  })

  it('should throw if customer does not exist', async () => {
    await expect(() => sut.execute({ document: '27981718066' })).rejects.toThrowError('Customer not found')
  })
})
