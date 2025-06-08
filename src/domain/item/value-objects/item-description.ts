import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class ItemDescription extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Item Description' }

  static create(aString: string): ItemDescription {
    this.validate(aString)
    return new ItemDescription(aString)
  }

  static restore(aString: string): ItemDescription {
    return new ItemDescription(aString)
  }
}
