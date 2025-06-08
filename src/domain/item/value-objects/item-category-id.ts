import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class ItemCategoryId extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Item CategoryId' }

  static create(aString: string): ItemCategoryId {
    this.validate(aString)
    return new ItemCategoryId(aString)
  }

  static restore(aString: string): ItemCategoryId {
    return new ItemCategoryId(aString)
  }
}
