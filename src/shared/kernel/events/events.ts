export const EVENTS = {
  ORDER_CREATED: 'order.created',
  PAYMENT_STATUS_UPDATED: 'payment.status-updated',
} as const

export type EventTypes = (typeof EVENTS)[keyof typeof EVENTS]
