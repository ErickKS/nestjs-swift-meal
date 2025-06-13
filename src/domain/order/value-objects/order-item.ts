import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'

interface OrderItemProps {
  itemId: UniqueEntityID
  name: string
  unitPrice: Amount
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

  get unitPrice(): number {
    return this.props.unitPrice.decimal
  }

  get quantity(): number {
    return this.props.quantity
  }

  get subtotal(): number {
    const quantity = this.props.quantity
    return this.props.unitPrice.multiply(quantity).decimal
  }

  static create(props: {
    itemId: string
    name: string
    unitPrice: number
    quantity: number
  }): OrderItem {
    if (props.quantity <= 0) throw new Error('Quantity must be greater than 0')
    return new OrderItem({
      itemId: UniqueEntityID.restore(props.itemId),
      name: props.name,
      unitPrice: Amount.createFromDecimal(props.unitPrice),
      quantity: props.quantity,
    })
  }

  static restore(props: {
    itemId: string
    name: string
    unitPrice: number
    quantity: number
  }): OrderItem {
    return OrderItem.create(props)
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
