import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class Document extends StringValue {
  private static DOCUMENT_LENGTH = 11
  private static DOCUMENT_INVALID_PATTERN = /^(\d)\1+$/

  protected static override rules: StringRules = {
    fieldName: 'Document',
    min: 11,
    max: 14,
  }

  static create(aString: string): Document {
    this.validate(aString)
    return new Document(aString)
  }

  static restore(aString: string): Document {
    return new Document(aString)
  }

  protected static override extraValidate(value: string): void {
    const digitsOnly = value.replace(/[^\d]/g, '')
    if (digitsOnly.length !== this.DOCUMENT_LENGTH || this.DOCUMENT_INVALID_PATTERN.test(digitsOnly)) throw new Error('Invalid CPF format')
    const calcCheckDigit = (base: string, factor: number): number => {
      const total = base
        .split('')
        .map(Number)
        .reduce((sum, num, index) => sum + num * (factor - index), 0)
      const rest = (total * 10) % 11
      return rest === 10 ? 0 : rest
    }
    const base = digitsOnly.substring(0, 9)
    const firstDigit = calcCheckDigit(base, 10)
    const secondDigit = calcCheckDigit(base + firstDigit, 11)
    const expectedCpf = base + firstDigit.toString() + secondDigit.toString()
    if (digitsOnly !== expectedCpf) throw new Error('Invalid CPF check digits')
  }
}
