import { StringRules, StringValue } from '@/shared/kernel/value-objects/string-value'

export class OrderItemName extends StringValue {
  protected static override rules: StringRules = { fieldName: 'Item Name' }

  static create(aString: string): OrderItemName {
    this.validate(aString)
    return new OrderItemName(aString)
  }

  static restore(aString: string): OrderItemName {
    return new OrderItemName(aString)
  }
}
