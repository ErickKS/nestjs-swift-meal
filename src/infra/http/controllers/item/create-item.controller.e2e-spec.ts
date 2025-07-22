import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'

describe('[POST] /items', () => {
  let app: INestApplication
  let prisma: PrismaService
  let categoryFactory: CategoryFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    categoryFactory = moduleRef.get(CategoryFactory)
    await app.init()
  })

  test('should create new item', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({})
    const input = {
      code: 'ITM-01',
      name: 'Item X',
      description: 'Description',
      price: 25.99,
      categoryId: newCategory.id,
    }
    const response = await request(app.getHttpServer()).post('/items').send(input)
    expect(response.statusCode).toBe(201)
    const itemOnDatabase = await prisma.item.findFirst({
      where: { name: 'Item X' },
    })
    expect(itemOnDatabase).toBeTruthy()
    expect(itemOnDatabase?.code).toBe('ITM-01')
    expect(itemOnDatabase?.name).toBe('Item X')
    expect(itemOnDatabase?.description).toBe('Description')
    expect(itemOnDatabase?.active).toBe(true)
    expect(itemOnDatabase?.price).toBe(2599)
    expect(itemOnDatabase?.categoryId).toBe(input.categoryId)
  })
})
