import { Order } from '@/domain/order/order'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id,
      code: order.code,
      customerId: order.customerId,
      status: order.status,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        itemId: item.itemId,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        subtotal: item.subtotal,
      })),
    }
  }

  static toMinimalHTTP(order: Order) {
    return {
      id: order.id,
      code: order.code,
    }
  }
}
