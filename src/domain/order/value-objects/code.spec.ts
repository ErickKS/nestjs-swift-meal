import { Code } from './code'

describe('Code Value Object', () => {
  it('should create a valid code', () => {
    const code = Code.create('CODE-123')
    expect(code.value).toBe('CODE-123')
  })

  it('should generate a valid code automatically', () => {
    const code = Code.create()
    const pattern = /^\d{6}-\d{4}$/
    expect(code.value).toMatch(pattern)
  })
})
