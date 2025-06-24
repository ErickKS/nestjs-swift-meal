import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'

describe('[POST] /orders', () => {
  let app: INestApplication
  let prisma: PrismaService
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory, ItemFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    await app.init()
  })

  test('should create new order', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({})
    const newItem = await itemFactory.makePrismaItem({ categoryId: newCategory.id, price: 12.5 })
    const input = {
      items: [
        {
          itemId: newItem.id,
          quantity: 2,
        },
      ],
    }
    const response = await request(app.getHttpServer()).post('/orders').send(input)
    expect(response.statusCode).toBe(201)
    const { id: orderId, code } = response.body
    expect(orderId).toBeDefined()
    expect(code).toBeDefined()
    const orderOnDatabase = await prisma.order.findFirst({
      where: { id: orderId },
    })
    expect(orderOnDatabase).toBeTruthy()
    expect(orderOnDatabase?.code).toBeDefined()
    expect(orderOnDatabase?.customerId).toBeNull()
    expect(orderOnDatabase?.total).toBe(2500)
    const orderItemsOnDatabase = await prisma.orderItem.findFirst({
      where: { orderId },
    })
    expect(orderItemsOnDatabase).toBeTruthy()
    expect(orderItemsOnDatabase?.itemId).toBe(newItem.id)
    expect(orderItemsOnDatabase?.name).toBe(newItem.name)
    expect(orderItemsOnDatabase?.quantity).toBe(2)
    expect(orderItemsOnDatabase?.unitPrice).toBe(1250)
  })
})
