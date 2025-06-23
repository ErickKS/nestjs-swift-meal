import { FetchOrdersSearchParams } from '@/application/order/@types/fetch-orders-search-filters'
import { OrderRepository } from '@/application/order/repositories/order-repository'
import { Order } from '@/domain/order/order'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(params: FetchOrdersSearchParams): Prisma.OrderWhereInput {
    const { code, status } = params
    const where: Prisma.OrderWhereInput = {}
    if (code) where.code = code
    if (status) where.status = status
    return where
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: true,
      },
    })
    if (!order) return null
    return PrismaOrderMapper.toDomain(order)
  }

  async findMany(params: FetchOrdersSearchParams): Promise<Order[]> {
    const { page = 1, perPage = 10, sortOrder = 'asc' } = params
    const skip = (page - 1) * perPage
    const take = perPage
    const where = this.buildSearchWhere(params)
    const rawItems = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: sortOrder },
      skip,
      take,
      include: { OrderItem: true },
    })
    return rawItems.map(PrismaOrderMapper.toDomain)
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)
    await this.prisma.$transaction(async tx => {
      await tx.order.create({
        data,
      })
    })
  }

  async count(params: FetchOrdersSearchParams): Promise<number> {
    const where: Prisma.OrderWhereInput = this.buildSearchWhere(params)
    return this.prisma.order.count({ where })
  }
}
