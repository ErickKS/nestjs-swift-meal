import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'

describe('[PATCH] /items/:itemId', () => {
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

  test('should update item details successfully', async () => {
    const category1 = await categoryFactory.makePrismaCategory({})
    const category2 = await categoryFactory.makePrismaCategory({})
    const item = await itemFactory.makePrismaItem({
      code: 'ITM-02',
      name: 'Old Name',
      description: 'Old Description',
      price: 10.0,
      categoryId: category1.id,
    })
    const response = await request(app.getHttpServer()).patch(`/items/${item.id}`).send({
      name: 'New Name',
      description: 'New Description',
      price: 19.99,
      active: false,
      categoryId: category2.id,
    })
    expect(response.statusCode).toBe(204)
    const updatedItem = await prisma.item.findUnique({
      where: { id: item.id },
    })
    expect(updatedItem?.name).toBe('New Name')
    expect(updatedItem?.description).toBe('New Description')
    expect(updatedItem?.price).toBe(1999)
    expect(updatedItem?.active).toBe(false)
    expect(updatedItem?.categoryId).toBe(category2.id)
  })
})
