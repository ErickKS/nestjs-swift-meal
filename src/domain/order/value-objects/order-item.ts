import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'

interface OrderItemProps {
  itemId: UniqueEntityID
  name: string
  unitPrice: Amount
  quantity: number
}

export interface OrderItemCreateProps {
  itemId: string
  name: string
  unitPriceDecimal: number
  quantity: number
}

export interface OrderItemRestoreProps {
  itemId: string
  name: string
  unitPriceCents: number
  quantity: number
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
    })
  }

  static restore(props: OrderItemRestoreProps): OrderItem {
    return new OrderItem({
      itemId: UniqueEntityID.restore(props.itemId),
      name: props.name,
      unitPrice: Amount.createFromCents(props.unitPriceCents),
      quantity: props.quantity,
    })
  }

  increaseQuantity(amount: number): OrderItem {
    return new OrderItem({
      ...this.props,
      quantity: this.props.quantity + amount,
    })
  }

  decreaseQuantity(amount: number): OrderItem {
    const newQuantity = this.props.quantity - amount
    if (newQuantity <= 0) throw new Error('Quantity must be greater than 0 after decrement')
    return new OrderItem({
      ...this.props,
      quantity: newQuantity,
    })
  }
}
