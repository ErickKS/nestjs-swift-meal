import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'
import { OrderFactory } from 'test/factories/make-order'

describe('[GET] /orders', () => {
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

  test('should fetch all orders', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({})
    const item = await itemFactory.makePrismaItem({
      code: 'PROD-001',
      price: 15,
      categoryId: newCategory.id,
    })
    await orderFactory.makePrismaOrder({
      items: [
        {
          itemId: item.id,
          name: item.name,
          unitPriceDecimal: item.price,
          quantity: 2,
        },
      ],
    })
    const response = await request(app.getHttpServer()).get('/orders').send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      total: 1,
      page: 1,
      perPage: 20,
      totalPages: 1,
      data: [
        expect.objectContaining({
          total: 30,
          items: expect.arrayContaining([
            expect.objectContaining({
              itemId: item.id,
              quantity: 2,
              unitPrice: 15,
              subtotal: 30,
            }),
          ]),
        }),
      ],
    })
  })
})
