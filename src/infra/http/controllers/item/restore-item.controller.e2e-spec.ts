import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { CategoryFactory } from 'test/factories/make-category'
import { ItemFactory } from 'test/factories/make-item'

describe('[POST] /items/:itemId/restore', () => {
  let app: INestApplication
  let prisma: PrismaService
  let categoryFactory: CategoryFactory
  let itemFactory: ItemFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ItemFactory, CategoryFactory],
    }).compile()
    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    categoryFactory = moduleRef.get(CategoryFactory)
    itemFactory = moduleRef.get(ItemFactory)
    await app.init()
  })

  test('should restore item', async () => {
    const category = await categoryFactory.makePrismaCategory()
    const newItem = await itemFactory.makePrismaItem({ categoryId: category.id, deletedAt: new Date() })
    const response = await request(app.getHttpServer()).post(`/items/${newItem.id}/restore`).send()
    expect(response.statusCode).toBe(204)
    const itemOnDatabase = await prisma.item.findFirst({
      where: { id: newItem.id },
    })
    expect(itemOnDatabase?.deletedAt).toBeNull()
  })
})
