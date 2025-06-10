import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'

describe('[GET] /customers', () => {
  let app: INestApplication
  let customerFactory: CustomerFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CustomerFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    customerFactory = moduleRef.get(CustomerFactory)
    await app.init()
  })

  test('should fetch all customers ordered by name asc by default', async () => {
    await customerFactory.makePrismaCustomer({ name: 'Alex' })
    await customerFactory.makePrismaCustomer({ name: 'Jonh' })
    await customerFactory.makePrismaCustomer({ name: 'Maria' })
    const response = await request(app.getHttpServer()).get('/customers').send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      total: 3,
      page: 1,
      perPage: 20,
      totalPages: 1,
      data: [
        expect.objectContaining({ name: 'Alex' }),
        expect.objectContaining({ name: 'Jonh' }),
        expect.objectContaining({ name: 'Maria' }),
      ],
    })
  })
})
