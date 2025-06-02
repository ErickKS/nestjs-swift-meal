export interface StringRules {
  min?: number
  max?: number
  allowEmpty?: boolean
  fieldName?: string
}

export abstract class StringValue {
  protected constructor(private readonly _value: string) {}

  get value(): string {
    return this._value
  }

  protected static rules: StringRules = {}

  protected static extraValidate(_value: string): void {}

  protected static validate(value: string): void {
    const { min = 1, max = 255, allowEmpty = false, fieldName = 'Value' } = this.rules
    if (!allowEmpty && value.trim().length === 0) throw new Error(`${fieldName} must not be empty`)
    if (value.length < min) throw new Error(`${fieldName} must be at least ${min} characters`)
    if (value.length > max) throw new Error(`${fieldName} must be at most ${max} characters`)
    this.extraValidate(value)
  }
}
