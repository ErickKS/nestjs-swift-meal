import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class ItemName extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Item Name' }

  static create(aString: string): ItemName {
    this.validate(aString)
    return new ItemName(aString)
  }

  static restore(aString: string): ItemName {
    return new ItemName(aString)
  }
}
