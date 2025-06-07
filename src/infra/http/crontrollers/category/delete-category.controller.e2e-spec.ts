import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'

describe('[DELETE] /categories', () => {
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

  test('should delete category', async () => {
    const newCategory = await categoryFactory.makePrismaCategory()
    const input = {
      categoryId: newCategory.id,
    }
    const response = await request(app.getHttpServer()).delete('/categories').send(input)
    expect(response.statusCode).toBe(204)
    const categoryOnDatabase = await prisma.category.findFirst({
      where: { id: newCategory.id },
    })
    expect(categoryOnDatabase?.deletedAt).toBeDefined()
  })
})
