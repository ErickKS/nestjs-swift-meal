import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class OrderCode extends StringValue {
  protected static override rules: StringRules = {
    fieldName: 'OrderCode',
  }

  static create(aString?: string): OrderCode {
    let code = aString
    if (code) {
      this.validate(code)
    } else {
      code = this.generate()
    }
    return new OrderCode(code)
  }

  static restore(aString: string): OrderCode {
    return new OrderCode(aString)
  }

  private static generate(): string {
    const now = new Date()
    const yyMMdd = now.toISOString().slice(2, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(4, '0')
    return `${yyMMdd}-${random}`
  }
}
