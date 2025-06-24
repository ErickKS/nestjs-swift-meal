import { Order } from '@/domain/order/order'
import {
  Prisma,
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
  OrderItemStatus as PrismaOrderItemStatus,
  OrderStatus as PrismaOrderStatus,
} from '@prisma/client'

type RawOrderWithItems = PrismaOrder & {
  OrderItem: PrismaOrderItem[]
}

export class PrismaOrderMapper {
  static toDomain(raw: RawOrderWithItems): Order {
    return Order.restore(
      {
        customerId: raw.customerId ?? undefined,
        code: raw.code,
        status: raw.status,
        total: raw.total,
        items: raw.OrderItem.map(item => ({
          itemId: item.itemId,
          name: item.name,
          unitPriceCents: item.unitPrice,
          quantity: item.quantity,
          status: item.status,
        })),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id
    )
  }

  static toPrismaWithItems(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id,
      customerId: order.customerId,
      code: order.code,
      status: order.status as PrismaOrderStatus,
      total: order.totalInCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      OrderItem: {
        create: order.items.map(item => ({
          itemId: item.itemId,
          name: item.name,
          unitPrice: item.unitPriceInCents,
          quantity: item.quantity,
        })),
      },
    }
  }

  static toPrismaWithoutItems(order: Order): Prisma.OrderUncheckedUpdateInput {
    return {
      customerId: order.customerId,
      code: order.code,
      status: order.status as PrismaOrderStatus,
      total: order.totalInCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  static toPrismaOrderItemList(order: Order): Prisma.OrderItemUncheckedCreateInput[] {
    return order.items.map(item => ({
      orderId: order.id,
      itemId: item.itemId,
      name: item.name,
      unitPrice: item.unitPriceInCents,
      quantity: item.quantity,
      status: item.status as PrismaOrderItemStatus,
    }))
  }
}
