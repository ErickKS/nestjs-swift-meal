import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class Code extends StringValue {
  protected static override rules: StringRules = {
    fieldName: 'Code',
  }

  static create(aString?: string): Code {
    let code = aString
    if (code) {
      this.validate(code)
    } else {
      code = this.generate()
    }
    return new Code(code)
  }

  static restore(aString: string): Code {
    return new Code(aString)
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
