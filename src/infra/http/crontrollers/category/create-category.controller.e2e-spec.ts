import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('[POST] /category', () => {
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

  test('should create new category', async () => {
    const input = {
      name: 'Category X',
    }
    const response = await request(app.getHttpServer()).post('/category').send(input)
    expect(response.statusCode).toBe(201)
    const categoryOnDatabase = await prisma.category.findFirst({
      where: { name: 'Category X' },
    })
    expect(categoryOnDatabase).toBeTruthy()
  })
})
