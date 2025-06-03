import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[POST] /category', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('should create new category', async () => {
    const input = {
      name: 'Category X',
    }
    const response = await request(app.getHttpServer()).post('/category').send(input)
    expect(response.statusCode).toBe(201)
  })
})
