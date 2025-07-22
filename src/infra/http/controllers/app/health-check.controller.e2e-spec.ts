import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[GET] /health-check', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('should be able to health check', async () => {
    const response = await request(app.getHttpServer()).get('/health-check').send()
    expect(response.statusCode).toBe(200)
  })
})
