import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[POST] /customers', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    await app.init()
  })

  test('should create new customer', async () => {
    const input = {
      name: 'John Doe',
      email: 'john.doe@email.com',
      document: '27981718066',
    }
    const response = await request(app.getHttpServer()).post('/customers').send(input)
    expect(response.statusCode).toBe(201)
    const customerOnDatabase = await prisma.customer.findFirst({
      where: { document: '27981718066' },
    })
    expect(customerOnDatabase).toBeTruthy()
  })
})
