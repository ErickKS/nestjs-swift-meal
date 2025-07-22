import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'

describe('[GET] /items', () => {
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

  test('should fetch all active items ordered by name asc by default', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({})
    await itemFactory.makePrismaItem({ name: 'Item 3', code: '3', price: 25.99, categoryId: newCategory.id })
    await itemFactory.makePrismaItem({ name: 'Item 2', code: '2', price: 20, categoryId: newCategory.id })
    await itemFactory.makePrismaItem({ name: 'Item 1', code: '1', price: 20, categoryId: newCategory.id, active: false })
    const response = await request(app.getHttpServer()).get('/items').send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      total: 2,
      page: 1,
      perPage: 20,
      totalPages: 1,
      data: [expect.objectContaining({ code: '2', price: 20 }), expect.objectContaining({ code: '3', price: 25.99 })],
    })
  })
})
