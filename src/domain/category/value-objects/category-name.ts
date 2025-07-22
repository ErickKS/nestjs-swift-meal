import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class CategoryName extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Category Name' }

  static create(aString: string): CategoryName {
    this.validate(aString)
    return new CategoryName(aString)
  }

  static restore(aString: string): CategoryName {
    return new CategoryName(aString)
  }
}
