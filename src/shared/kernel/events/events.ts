export const EVENTS = {
  ORDER_CREATED: 'order.created',
  PAYMENT_UPDATED: 'payment.updated',
} as const

export type EventTypes = (typeof EVENTS)[keyof typeof EVENTS]
