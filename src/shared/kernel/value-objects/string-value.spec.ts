import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

class Username extends StringValue {
  protected static override rules: StringRules = {
    min: 3,
    max: 10,
    allowEmpty: false,
    fieldName: 'Username',
  }

  static create(aString: string): Username {
    this.validate(aString)
    return new Username(aString)
  }

  static restore(aString: string): Username {
    return new Username(aString)
  }

  protected static override extraValidate(value: string): void {
    const alphaRegex = /^[a-zA-Z]+$/
    if (!alphaRegex.test(value)) throw new Error('Username must contain only letters')
  }
}

describe('Username (extends StringValue with extraValidate)', () => {
  it('should create a valid username with letters only', () => {
    const username = Username.create('Alice')
    expect(username.value).toBe('Alice')
  })

  it('should throw error if username contains numbers', () => {
    expect(() => Username.create('Alice123')).toThrowError('Username must contain only letters')
  })

  it('should throw error if username contains symbols', () => {
    expect(() => Username.create('Al!ce')).toThrowError('Username must contain only letters')
  })

  it('should throw error if username is too short', () => {
    expect(() => Username.create('Al')).toThrowError('Username must be at least 3 characters')
  })

  it('should throw error if username is too long', () => {
    expect(() => Username.create('LongUsername')).toThrowError('Username must be at most 10 characters')
  })

  it('should throw error if username is empty', () => {
    expect(() => Username.create('')).toThrowError('Username must not be empty')
  })

  it('should throw error if username is only whitespace', () => {
    expect(() => Username.create('   ')).toThrowError('Username must not be empty')
  })
})
