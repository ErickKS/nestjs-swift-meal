import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[PATCH] /example', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('should update category name', async () => {
    const input = {
      categoryId: 'category-1',
      name: 'Category X',
    }
    const response = await request(app.getHttpServer()).patch('/category').send(input)
    expect(response.statusCode).toBe(200)
  })
})
