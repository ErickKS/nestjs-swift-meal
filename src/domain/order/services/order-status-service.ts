import { OrderStatusEnum } from '../value-objects/order-status/order-status'

export class OrderStatusService {
  private static readonly transitions: Record<string, string[]> = {
    [OrderStatusEnum.PAYMENT_PENDING]: [OrderStatusEnum.PAID, OrderStatusEnum.CANCELED],
    [OrderStatusEnum.PAID]: [OrderStatusEnum.PREPARING, OrderStatusEnum.CANCELED],
    [OrderStatusEnum.PREPARING]: [OrderStatusEnum.READY, OrderStatusEnum.CANCELED],
    [OrderStatusEnum.READY]: [OrderStatusEnum.COMPLETED, OrderStatusEnum.CANCELED],
    [OrderStatusEnum.COMPLETED]: [],
    [OrderStatusEnum.CANCELED]: [],
  }

  static canTransition(from: string, to: string): boolean {
    return this.transitions[from]?.includes(to) ?? false
  }
}
