import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'

describe('[GET] /categories', () => {
  let app: INestApplication
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    categoryFactory = moduleRef.get(CategoryFactory)
    await app.init()
  })

  test('should fetch all active categories ordered by name asc by default', async () => {
    await categoryFactory.makePrismaCategory({ name: 'Category 3' })
    await categoryFactory.makePrismaCategory({ name: 'Category 2' })
    await categoryFactory.makePrismaCategory({ name: 'Category 1', deletedAt: new Date() })
    const response = await request(app.getHttpServer()).get('/categories').send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({ name: 'Category 2' }),
        expect.objectContaining({ name: 'Category 3' }),
      ]),
    })
  })
})
