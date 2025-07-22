import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'
import { OrderFactory } from 'test/factories/make-order'
import { PaymentFactory } from 'test/factories/make-payment'

describe('[GET] /orders/:orderId', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory
  let orderFactory: OrderFactory
  let paymentFactory: PaymentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ItemFactory, CategoryFactory, OrderFactory, PaymentFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    orderFactory = moduleRef.get(OrderFactory)
    paymentFactory = moduleRef.get(PaymentFactory)
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
    await paymentFactory.makePrismaPayment({ amount: 3000, orderId: order.id })
    const response = await request(app.getHttpServer()).get(`/payments/orders/${order.id}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      payment: {
        status: 'PENDING',
        amount: 30,
        qrCode: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      },
    })
  })
})
