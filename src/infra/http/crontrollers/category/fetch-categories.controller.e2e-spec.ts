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

  test('should fetch all categories ordered by name', async () => {
    await categoryFactory.makePrismaQuestion({ name: 'Category 2' })
    await categoryFactory.makePrismaQuestion({ name: 'Category 1' })
    const response = await request(app.getHttpServer()).get('/categories').send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      categories: expect.arrayContaining([
        expect.objectContaining({ name: 'Category 1' }),
        expect.objectContaining({ name: 'Category 2' }),
      ]),
    })
  })
})
