import { AppModule } from '@/app.module'
import { OrderItemStatusEnum } from '@/domain/order/value-objects/order-item'
import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'
import { OrderFactory } from 'test/factories/make-order'

describe('[PATCH] /orders/:orderId/items/:itemId', () => {
  let app: INestApplication
  let prisma: PrismaService
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ItemFactory, CategoryFactory, OrderFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    orderFactory = moduleRef.get(OrderFactory)
    await app.init()
  })

  test('should update order item', async () => {
    const category = await categoryFactory.makePrismaCategory({})
    const item = await itemFactory.makePrismaItem({
      code: 'PROD-001',
      name: 'Product 1',
      price: 15,
      categoryId: category.id,
    })
    const anotherItem = await itemFactory.makePrismaItem({
      code: 'PROD-002',
      name: 'Product 2',
      price: 10,
      categoryId: category.id,
    })
    const order = await orderFactory.makePrismaOrder({
      status: OrderStatusEnum.PAID,
      items: [
        {
          itemId: item.id,
          name: item.name,
          unitPriceDecimal: item.price,
          quantity: 2,
        },
        {
          itemId: anotherItem.id,
          name: anotherItem.name,
          unitPriceDecimal: anotherItem.price,
          quantity: 1,
        },
      ],
    })
    const response = await request(app.getHttpServer()).patch(`/orders/${order.id}/items/${item.id}`).send({
      status: OrderItemStatusEnum.CANCELED,
    })
    const response2 = await request(app.getHttpServer()).patch(`/orders/${order.id}/items/${anotherItem.id}`).send({
      quantity: 2,
    })
    expect(response.statusCode).toBe(204)
    expect(response2.statusCode).toBe(204)
    const orderOnDatabase = await prisma.order.findFirst({
      where: { id: order.id },
      include: {
        OrderItem: true,
      },
    })
    expect(orderOnDatabase?.total).toBe(2000)
    expect(orderOnDatabase?.OrderItem).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          quantity: 2,
          status: 'CANCELED',
        }),
        expect.objectContaining({
          quantity: 2,
          status: 'ACTIVE',
        }),
      ])
    )
  })
})
