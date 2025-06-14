import { Entity } from '@/shared/kernel/entities/entity'
import { Amount } from '@/shared/kernel/value-objects/amount'
import { UniqueEntityID } from '@/shared/kernel/value-objects/unique-entity-id'
import { OrderStatusFactory } from './factories/order-satus-factory'
import { OrderCode } from './value-objects/order-code'
import { OrderItem, type OrderItemCreateProps, type OrderItemRestoreProps } from './value-objects/order-item'
import { OrderStatus } from './value-objects/order-status/order-status'
import { OrderStatusPaymentPending } from './value-objects/order-status/order-status-payment-pending'

export interface OrderProps {
  customerId: UniqueEntityID | null
  code: OrderCode
  status: OrderStatus
  total: Amount
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateOrderProps {
  customerId?: string
  code?: string
  status?: string
  items: OrderItemCreateProps[]
  createdAt?: Date
  updatedAt?: Date
}

interface RestoreOrderProps {
  customerId?: string
  code: string
  status: string
  items: OrderItemRestoreProps[]
  total: number
  createdAt: Date
  updatedAt: Date
}

export class Order extends Entity<OrderProps> {
  get customerId(): string | null {
    return this.props.customerId?.value ?? null
  }

  get code(): string {
    return this.props.code.value
  }

  get status(): string {
    return this.props.status.value()
  }

  get total(): number {
    return this.props.total.decimal
  }

  get totalInCents(): number {
    return this.props.total.cents
  }

  get items(): OrderItem[] {
    return this.props.items
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

  static create(props: CreateOrderProps, id?: string): Order {
    const items = props.items.map(OrderItem.create)
    const total = Order.calculateTotal(items)
    return new Order(
      {
        customerId: props.customerId ? UniqueEntityID.restore(props.customerId) : null,
        code: OrderCode.create(props.code),
        status: props.status ? OrderStatusFactory.from(props.status) : new OrderStatusPaymentPending(),
        items,
        total,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      UniqueEntityID.create(id)
    )
  }

  static restore(props: RestoreOrderProps, id: string): Order {
    const items = props.items.map(OrderItem.restore)
    return new Order(
      {
        customerId: props.customerId ? UniqueEntityID.restore(props.customerId) : null,
        code: OrderCode.restore(props.code),
        status: OrderStatusFactory.from(props.status),
        items,
        total: Amount.createFromCents(props.total),
        createdAt: props.createdAt,
        updatedAt: props.updatedAt,
      },
      UniqueEntityID.restore(id)
    )
  }

  pay() {
    this.props.status.pay(this)
  }

  prepare() {
    this.props.status.prepare(this)
  }

  ready() {
    this.props.status.ready(this)
  }

  complete() {
    this.props.status.complete(this)
  }

  cancel() {
    this.props.status.cancel(this)
  }

  changeStatus(newStatus: OrderStatus) {
    this.props.status = newStatus
    this.touch()
  }

  addItem(item: OrderItem): void {
    const index = this.props.items.findIndex(i => i.itemId === item.itemId)
    if (index >= 0) {
      this.props.items[index] = this.props.items[index].increaseQuantity(item.quantity)
    } else {
      this.props.items.push(item)
    }
    this.recalculateTotal()
    this.touch()
  }

  removeItem(itemId: string): void {
    const index = this.props.items.findIndex(i => i.itemId === itemId)
    if (index < 0) throw new Error('Item not found')
    this.props.items.splice(index, 1)
    this.recalculateTotal()
    this.touch()
  }

  private static calculateTotal(items: OrderItem[]): Amount {
    return items
      .map(i => Amount.createFromCents(i.unitPrice).multiply(i.quantity))
      .reduce((sum, amt) => sum.add(amt), Amount.createFromCents(0))
  }

  private recalculateTotal(): void {
    this.props.total = Order.calculateTotal(this.props.items)
  }
}
