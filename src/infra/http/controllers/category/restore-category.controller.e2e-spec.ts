import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'

describe('[POST] /categories/{categoryId}/restore', () => {
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

  test('should restore category', async () => {
    const newCategory = await categoryFactory.makePrismaCategory({ deletedAt: new Date() })
    const response = await request(app.getHttpServer()).post(`/categories/${newCategory.id}/restore`).send()
    expect(response.statusCode).toBe(204)
    const categoryOnDatabase = await prisma.category.findFirst({
      where: { id: newCategory.id },
    })
    expect(categoryOnDatabase?.deletedAt).toBe(null)
  })
})
