import { randomUUID } from 'node:crypto'
import { CreateOrderProps, Order } from '@/domain/order/order'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrder(override: Partial<CreateOrderProps> = {}, id?: string) {
  const items = override.items ?? [
    {
      itemId: randomUUID(),
      name: faker.commerce.product(),
      unitPriceDecimal: Number(faker.commerce.price()),
      quantity: 1,
    },
  ]
  const order = Order.create(
    {
      customerId: override.customerId,
      code: override.code,
      status: override.status,
      items,
      createdAt: override.createdAt,
      updatedAt: override.updatedAt,
    },
    id
  )
  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<CreateOrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)
    await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
      include: { OrderItem: true },
    })
    return order
  }
}
