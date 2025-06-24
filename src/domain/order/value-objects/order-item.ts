import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'

export enum OrderItemStatusEnum {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
}

interface OrderItemProps {
  itemId: UniqueEntityID
  name: string
  unitPrice: Amount
  quantity: number
  status: OrderItemStatusEnum
}

export interface OrderItemCreateProps {
  itemId: string
  name: string
  unitPriceDecimal: number
  quantity: number
  status?: string
}

export interface OrderItemRestoreProps {
  itemId: string
  name: string
  unitPriceCents: number
  quantity: number
  status: string
}

export class OrderItem {
  private constructor(private readonly props: OrderItemProps) {}

  get itemId(): string {
    return this.props.itemId.value
  }

  get name(): string {
    return this.props.name
  }

  get unitPriceInDecimal(): number {
    return this.props.unitPrice.decimal
  }

  get unitPriceInCents(): number {
    return this.props.unitPrice.cents
  }

  get quantity(): number {
    return this.props.quantity
  }

  get status(): OrderItemStatusEnum {
    return this.props.status
  }

  get subtotalInDecimal(): number {
    const quantity = this.props.quantity
    return this.props.unitPrice.multiply(quantity).decimal
  }

  static create(props: OrderItemCreateProps): OrderItem {
    if (props.quantity <= 0) throw new Error('Quantity must be greater than 0')
    return new OrderItem({
      itemId: UniqueEntityID.create(props.itemId),
      name: props.name,
      unitPrice: Amount.createFromDecimal(props.unitPriceDecimal),
      quantity: props.quantity,
      status: props.status ? OrderItem.parseStatus(props.status) : OrderItemStatusEnum.ACTIVE,
    })
  }

  static restore(props: OrderItemRestoreProps): OrderItem {
    return new OrderItem({
      itemId: UniqueEntityID.restore(props.itemId),
      name: props.name,
      unitPrice: Amount.createFromCents(props.unitPriceCents),
      quantity: props.quantity,
      status: OrderItem.parseStatus(props.status),
    })
  }

  updateStatus(status: OrderItemStatusEnum): OrderItem {
    return new OrderItem({
      ...this.props,
      status,
    })
  }

  updateQuantity(quantity: number): OrderItem {
    if (quantity <= 0) throw new Error('Quantity must be greater than 0')
    return new OrderItem({
      ...this.props,
      quantity,
    })
  }

  static parseStatus(aString: string): OrderItemStatusEnum {
    if (aString !== OrderItemStatusEnum.ACTIVE && aString !== OrderItemStatusEnum.CANCELED) {
      throw new Error(`Invalid order item status: ${aString}`)
    }
    return aString as OrderItemStatusEnum
  }
}
