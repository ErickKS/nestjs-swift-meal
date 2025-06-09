import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class Name extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Name' }

  static create(aString: string): Name {
    this.validate(aString)
    return new Name(aString)
  }

  static restore(aString: string): Name {
    return new Name(aString)
  }
}
