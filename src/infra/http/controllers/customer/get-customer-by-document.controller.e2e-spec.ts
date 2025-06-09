import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CustomerFactory } from 'test/factories/make-customer'

describe('[GET] /customers/:document', () => {
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

  test('should get customer by document', async () => {
    const newCustomer = await customerFactory.makePrismaCustomer({
      name: 'John Doe',
      email: 'john.doe@email.com',
      document: '27981718066',
    })
    const response = await request(app.getHttpServer()).get(`/customers/${newCustomer.document}`).send()
    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      customer: {
        id: newCustomer.id,
        name: 'John Doe',
        document: '27981718066',
        email: 'john.doe@email.com',
        createdAt: expect.any(String),
      },
    })
  })
})
