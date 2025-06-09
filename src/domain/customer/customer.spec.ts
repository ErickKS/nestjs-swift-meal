import { Customer } from './customer'

const makeValidProps = () => ({
  name: 'John Doe',
  email: 'john.doe@email.com',
  document: '27981718066',
})

describe('Customer Entity', () => {
  it('should create an customer with valid properties', () => {
    const props = makeValidProps()
    const customer = Customer.create(props)
    expect(customer.name).toBe(props.name)
    expect(customer.email).toBe(props.email)
    expect(customer.document).toBe(props.document)
    expect(customer.createdAt).toBeDefined()
  })

  it('should restore an customer', () => {
    const props = makeValidProps()
    const customer = Customer.restore(
      {
        ...props,
        createdAt: new Date(),
      },
      'customer-1'
    )
    expect(customer.id).toBe('customer-1')
    expect(customer.name).toBe(props.name)
    expect(customer.email).toBe(props.email)
    expect(customer.document).toBe(props.document)
    expect(customer.createdAt).toBeDefined()
  })
})
