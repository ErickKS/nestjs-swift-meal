export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class PaymentStatus {
  private constructor(private readonly _value: PaymentStatusEnum) {}

  get value(): PaymentStatusEnum {
    return this._value
  }

  static create(aString: string): PaymentStatus {
    const status = aString.toUpperCase() as PaymentStatusEnum
    if (!Object.values(PaymentStatusEnum).includes(status)) {
      throw new Error(`Invalid payment status: ${aString}`)
    }
    return new PaymentStatus(status)
  }

  static restore(aString: string): PaymentStatus {
    return new PaymentStatus(aString as PaymentStatusEnum)
  }

  static pending(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.PENDING)
  }

  static approved(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.APPROVED)
  }

  static failed(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.FAILED)
  }

  static refunded(): PaymentStatus {
    return new PaymentStatus(PaymentStatusEnum.REFUNDED)
  }
}
