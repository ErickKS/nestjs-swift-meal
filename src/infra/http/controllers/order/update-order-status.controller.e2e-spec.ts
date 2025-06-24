import { AppModule } from '@/app.module'
import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'
import { OrderFactory } from 'test/factories/make-order'

describe('[PATCH] /orders/:orderId/status', () => {
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

  test('should update order status', async () => {
    const category = await categoryFactory.makePrismaCategory({})
    const item = await itemFactory.makePrismaItem({
      code: 'PROD-001',
      name: 'Product 1',
      price: 15,
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
      ],
    })
    const response = await request(app.getHttpServer()).patch(`/orders/${order.id}/status`).send({
      status: OrderStatusEnum.PREPARING,
    })
    expect(response.statusCode).toBe(204)
    const orderOnDatabase = await prisma.order.findFirst({
      where: { id: order.id },
    })
    expect(orderOnDatabase?.status).toBe(OrderStatusEnum.PREPARING)
  })
})
