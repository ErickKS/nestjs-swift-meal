import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[POST] /example', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    await app.init()
  })

  test('should be able to execute an example request', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.dow@email.com',
      password: 'asdQWE123',
    }
    const response = await request(app.getHttpServer()).post('/example').send(input)
    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        userId: expect.any(String),
      })
    )
  })
})
