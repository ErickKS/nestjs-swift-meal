import { Entity } from '@/shared/kernel/entities/entity'
import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'

export enum PaymentStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface PaymentProps {
  orderId: UniqueEntityID
  externalId: string
  status: PaymentStatusEnum
  amount: Amount
  qrCode: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentProps {
  orderId: string
  externalId?: string
  status?: PaymentStatusEnum
  amount: number
  qrCode?: string
  createdAt?: Date
  updatedAt?: Date
}

interface RestorePaymentProps {
  orderId: string
  externalId: string
  status: string
  amount: number
  qrCode: string
  createdAt: Date
  updatedAt: Date
}

export class Payment extends Entity<PaymentProps> {
  get orderId(): string {
    return this.props.orderId.value
  }

  get externalId(): string {
    return this.props.externalId
  }

  get status(): PaymentStatusEnum {
    return this.props.status
  }

  get amountInDecimal(): number {
    return this.props.amount.decimal
  }

  get amountInCents(): number {
    return this.props.amount.cents
  }

  get qrCode(): string {
    return this.props.qrCode
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  touch(): void {
    this.props.updatedAt = new Date()
  }

  static create(props: CreatePaymentProps, id?: string): Payment {
    return new Payment(
      {
        orderId: UniqueEntityID.create(props.orderId),
        externalId: props.externalId ?? '123',
        status: props.status ?? PaymentStatusEnum.PENDING,
        qrCode: props.qrCode ?? 'asdQWE123',
        amount: Amount.createFromCents(props.amount),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: RestorePaymentProps, id: string): Payment {
    return new Payment(
      {
        orderId: UniqueEntityID.restore(props.orderId),
        externalId: props.externalId,
        status: this.parseStatus(props.status),
        qrCode: props.qrCode,
        amount: Amount.createFromCents(props.amount),
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      UniqueEntityID.restore(id)
    )
  }

  private static parseStatus(aString: string): PaymentStatusEnum {
    const isValidPaymentStatus = Object.values(PaymentStatusEnum).includes(aString as PaymentStatusEnum)
    if (!isValidPaymentStatus) throw new Error(`Invalid payment status: ${aString}`)
    return aString as PaymentStatusEnum
  }

  updateStatus(status: PaymentStatusEnum) {
    this.props.status = status
    this.touch()
  }
}
