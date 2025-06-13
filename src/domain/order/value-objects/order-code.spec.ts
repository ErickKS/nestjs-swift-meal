import { OrderCode } from './order-code'

describe('OrderCode Value Object', () => {
  it('should create a valid code', () => {
    const code = OrderCode.create('CODE-123')
    expect(code.value).toBe('CODE-123')
  })

  it('should generate a valid code automatically', () => {
    const code = OrderCode.create()
    const pattern = /^\d{6}-\d{4}$/
    expect(code.value).toMatch(pattern)
  })
})
