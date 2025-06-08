import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class ItemCode extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Item Code' }

  static create(aString: string): ItemCode {
    this.validate(aString)
    return new ItemCode(aString)
  }

  static restore(aString: string): ItemCode {
    return new ItemCode(aString)
  }
}
