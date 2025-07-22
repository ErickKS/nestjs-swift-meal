import { Item } from '@/domain/item/item'
import { Prisma, Item as PrismaItem } from '@prisma/client'

export class PrismaItemMapper {
  static toDomain(raw: PrismaItem): Item {
    return Item.restore(
      {
        code: raw.code,
        name: raw.name,
        description: raw.description,
        price: raw.price,
        active: raw.active,
        categoryId: raw.categoryId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
        deletedAt: raw.deletedAt ?? undefined,
      },
      raw.id
    )
  }

  static toPrisma(Item: Item): Prisma.ItemUncheckedCreateInput {
    return {
      id: Item.id,
      code: Item.code,
      name: Item.name,
      description: Item.description,
      price: Item.priceInCents,
      active: Item.active,
      categoryId: Item.categoryId,
      createdAt: Item.createdAt,
      updatedAt: Item.updatedAt,
      deletedAt: Item.deletedAt,
    }
  }
}
