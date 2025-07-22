export class Amount {
  private constructor(private readonly _value: number) {}

  static createFromDecimal(aNumber: number): Amount {
    const adjusted = Math.max(0, aNumber)
    return new Amount(Math.round(adjusted * 100))
  }

  static createFromCents(aNumber: number): Amount {
    const adjusted = Math.max(0, aNumber)
    return new Amount(adjusted)
  }

  get decimal(): number {
    return this._value / 100
  }

  get cents(): number {
    return this._value
  }

  multiply(factor: number): Amount {
    const result = Math.round(this._value * factor)
    return new Amount(result)
  }

  add(amount: Amount): Amount {
    return new Amount(this._value + amount.cents)
  }

  subtract(amount: Amount): Amount {
    const result = this._value - amount.cents
    return new Amount(result)
  }

  equals(amount: Amount): boolean {
    return this._value === amount.cents
  }
}
