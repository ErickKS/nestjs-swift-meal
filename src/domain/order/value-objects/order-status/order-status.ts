import { Order } from '../../order'

export enum OrderStatusEnum {
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  READY = 'READY',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export abstract class OrderStatus {
  abstract value(): string

  abstract pay(order: Order): void
  abstract prepare(order: Order): void
  abstract ready(order: Order): void
  abstract complete(order: Order): void
  abstract cancel(order: Order): void
}
