import { OrderStatusEnum } from '../value-objects/order-status/order-status'
import { OrderStatusCanceled } from '../value-objects/order-status/order-status-canceled'
import { OrderStatusCompleted } from '../value-objects/order-status/order-status-completed'
import { OrderStatusPaid } from '../value-objects/order-status/order-status-paid'
import { OrderStatusPaymentPending } from '../value-objects/order-status/order-status-payment-pending'
import { OrderStatusPreparing } from '../value-objects/order-status/order-status-preparing'
import { OrderStatusReady } from '../value-objects/order-status/order-status-ready'
import { OrderStatusFactory } from './order-satus-factory'

describe('OrderStatusFactory', () => {
  it('should create OrderStatusPaymentPending from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.PAYMENT_PENDING)
    expect(status).toBeInstanceOf(OrderStatusPaymentPending)
    expect(status.value()).toBe(OrderStatusEnum.PAYMENT_PENDING)
  })

  it('should create OrderStatusPaid from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.PAID)
    expect(status).toBeInstanceOf(OrderStatusPaid)
    expect(status.value()).toBe(OrderStatusEnum.PAID)
  })

  it('should create OrderStatusPreparing from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.PREPARING)
    expect(status).toBeInstanceOf(OrderStatusPreparing)
    expect(status.value()).toBe(OrderStatusEnum.PREPARING)
  })

  it('should create OrderStatusReady from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.READY)
    expect(status).toBeInstanceOf(OrderStatusReady)
    expect(status.value()).toBe(OrderStatusEnum.READY)
  })

  it('should create OrderStatusCompleted from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.COMPLETED)
    expect(status).toBeInstanceOf(OrderStatusCompleted)
    expect(status.value()).toBe(OrderStatusEnum.COMPLETED)
  })

  it('should create OrderStatusCanceled from enum', () => {
    const status = OrderStatusFactory.from(OrderStatusEnum.CANCELED)
    expect(status).toBeInstanceOf(OrderStatusCanceled)
    expect(status.value()).toBe(OrderStatusEnum.CANCELED)
  })

  it('should throw error for invalid status name', () => {
    expect(() => {
      OrderStatusFactory.from('INVALID_STATUS')
    }).toThrowError('Invalid order status: INVALID_STATUS')
  })
})
