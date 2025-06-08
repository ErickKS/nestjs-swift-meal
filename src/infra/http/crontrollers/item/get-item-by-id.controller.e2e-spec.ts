import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'

describe('[GET] /items/:itemId', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ItemFactory, CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    await app.init()
  })

  test('should get item by id', async () => {
    const category = await categoryFactory.makePrismaCategory()
    const newItem = await itemFactory.makePrismaItem({
      code: '123',
      name: 'Item 1',
      description: 'Description 1',
      price: 2090,
      categoryId: category.id,
    })
    const response = await request(app.getHttpServer()).get(`/items/${newItem.id}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      item: {
        id: newItem.id,
        code: '123',
        name: 'Item 1',
        description: 'Description 1',
        price: 2090,
        active: true,
        categoryId: category.id,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        deletedAt: null,
      },
    })
  })
})
