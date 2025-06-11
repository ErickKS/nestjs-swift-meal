import { Email } from './email'

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('user@example.com')
    expect(email.value).toBe('user@example.com')
  })

  it('should throw if email is empty', () => {
    expect(() => Email.create('')).toThrow('Email must not be empty')
  })

  it('should throw if email is invalid', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid Email format')
    expect(() => Email.create('user@')).toThrow('Invalid Email format')
    expect(() => Email.create('@example.com')).toThrow('Invalid Email format')
    expect(() => Email.create('user@example')).toThrow('Invalid Email format')
  })

  it('should restore without validation', () => {
    const email = Email.restore('not-an-email')
    expect(email.value).toBe('not-an-email')
  })
})
