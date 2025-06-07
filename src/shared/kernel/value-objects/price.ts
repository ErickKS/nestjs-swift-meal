export class Price {
  private constructor(private readonly _value: number) {}

  static createFromDecimal(aNumber: number): Price {
    const adjusted = Math.max(0, aNumber)
    return new Price(Math.round(adjusted * 100))
  }

  static createFromCents(aNumber: number): Price {
    const adjusted = Math.max(0, aNumber)
    return new Price(adjusted)
  }

  get decimal(): number {
    return this._value / 100
  }

  get cents(): number {
    return this._value
  }
}
