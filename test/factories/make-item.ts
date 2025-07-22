import { randomUUID } from 'node:crypto'
import { CreateItemProps, Item } from '@/domain/item/item'
import { PrismaItemMapper } from '@/infra/database/prisma/mappers/prisma-item-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeItem(override: Partial<CreateItemProps> = {}, id?: string) {
  const item = Item.create(
    {
      code: faker.commerce.isbn(),
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: Number(faker.commerce.price()),
      categoryId: randomUUID(),
      ...override,
    },
    id
  )
  return item
}

@Injectable()
export class ItemFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaItem(data: Partial<CreateItemProps> = {}): Promise<Item> {
    const item = makeItem(data)
    await this.prisma.item.create({
      data: PrismaItemMapper.toPrisma(item),
    })
    return item
  }
}
