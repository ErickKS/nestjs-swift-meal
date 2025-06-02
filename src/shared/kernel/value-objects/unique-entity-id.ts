import { randomUUID } from 'node:crypto'

export class UniqueEntityID {
  private constructor(private readonly _value: string) {}

  get value(): string {
    return this._value
  }

  private static generate(): string {
    return randomUUID()
  }

  static create(aString?: string): UniqueEntityID {
    return new UniqueEntityID(aString ?? this.generate())
  }

  static restore(aString: string): UniqueEntityID {
    return new UniqueEntityID(aString)
  }
}
