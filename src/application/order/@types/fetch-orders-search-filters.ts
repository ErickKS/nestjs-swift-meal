import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'

export type FetchOrdersSearchParams = {
  code?: string
  status?: OrderStatusEnum
  page?: number
  perPage?: number
  sortOrder?: 'asc' | 'desc'
}
