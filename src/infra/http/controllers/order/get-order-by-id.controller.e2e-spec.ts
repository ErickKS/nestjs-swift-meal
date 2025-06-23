import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'
import { OrderFactory } from 'test/factories/make-order'

describe('[GET] /orders/:orderId', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ItemFactory, CategoryFactory, OrderFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    orderFactory = moduleRef.get(OrderFactory)
    await app.init()
  })

  test('should get order by id', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({})
    const item = await itemFactory.makePrismaItem({
      code: 'PROD-001',
      name: 'Product 1',
      price: 15,
      categoryId: newCategory.id,
    })
    const order = await orderFactory.makePrismaOrder({
      items: [
        {
          itemId: item.id,
          name: item.name,
          unitPriceDecimal: item.price,
          quantity: 2,
        },
      ],
    })
    const response = await request(app.getHttpServer()).get(`/orders/${order.id}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      order: {
        id: order.id,
        customerId: null,
        code: expect.any(String),
        status: 'PAYMENT_PENDING',
        total: 30,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        items: [
          {
            itemId: item.id,
            name: 'Product 1',
            unitPrice: 15,
            quantity: 2,
            subtotal: 30,
          },
        ],
      },
    })
  })
})
