import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class Email extends StringValue {
  private static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  protected static override rules: StringRules = {
    fieldName: 'Email',
    min: 5,
    max: 255,
  }

  static create(aString: string): Email {
    this.validate(aString)
    return new Email(aString)
  }

  static restore(aString: string): Email {
    return new Email(aString)
  }

  protected static override extraValidate(value: string): void {
    if (!this.EMAIL_REGEX.test(value)) throw new Error('Invalid Email format')
  }
}
