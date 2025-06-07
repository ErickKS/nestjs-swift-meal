import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Item } from '@/domain/item/item'
import { Injectable } from '@nestjs/common'
import { PrismaItemMapper } from '../mappers/prisma-item-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaItemRepository implements ItemRepository {
  constructor(private prisma: PrismaService) {}

  async existsByCode(code: string): Promise<boolean> {
    const item = await this.prisma.item.findUnique({
      where: {
        code,
      },
    })
    return !!item
  }

  async save(item: Item): Promise<void> {
    const data = PrismaItemMapper.toPrisma(item)
    await this.prisma.item.create({
      data,
    })
  }
}
