import { Entity } from '@/shared/kernel/entities/entity'
import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'
import { PaymentStatus, PaymentStatusEnum } from './value-objects/payment-status'

export interface PaymentProps {
  orderId: UniqueEntityID
  externalId: string
  status: PaymentStatus
  amount: Amount
  qrCode: string
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentProps {
  orderId: string
  externalId?: string
  status?: string
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
    return this.props.status.value
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
        status: props.status ? PaymentStatus.create(props.status) : PaymentStatus.pending(),
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
        status: PaymentStatus.restore(props.status),
        qrCode: props.qrCode,
        amount: Amount.createFromCents(props.amount),
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      UniqueEntityID.restore(id)
    )
  }

  updateStatus(status: PaymentStatus) {
    this.props.status = status
    this.touch()
  }
}
