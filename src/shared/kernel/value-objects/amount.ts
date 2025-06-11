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
}
