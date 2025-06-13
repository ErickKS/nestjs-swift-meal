import { Order } from '../order'

export abstract class OrderStatus {
  abstract value(): string

  abstract pay(order: Order): void
  abstract prepare(order: Order): void
  abstract ready(order: Order): void
  abstract complete(order: Order): void
  abstract cancel(order: Order): void
}
