import { FetchCustomersSearchParams } from '@/application/customer/@types/fetch-custormers-search-filters'
import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { Customer } from '@/domain/customer/customer'
import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

  private buildSearchWhere(params: FetchCustomersSearchParams): Prisma.CustomerWhereInput {
    const { name, document, email } = params
    const where: Prisma.CustomerWhereInput = {}
    if (name) where.name = { contains: name, mode: 'insensitive' }
    if (document) where.document = document
    if (email) where.email = email
    return where
  }

  async existsByDocument(document: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        document,
      },
    })
    return !!customer
  }

  async existsByEmail(email: string): Promise<boolean> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })
    return !!customer
  }

  async findMany(params: FetchCustomersSearchParams): Promise<Customer[]> {
    const { page = 1, perPage = 10, sortOrder = 'asc' } = params
    const skip = (page - 1) * perPage
    const take = perPage
    const where = this.buildSearchWhere(params)
    const rawCustomers = await this.prisma.customer.findMany({
      where,
      orderBy: { name: sortOrder },
      skip,
      take,
    })
    return rawCustomers.map(PrismaCustomerMapper.toDomain)
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { document },
    })
    if (!customer) return null
    return PrismaCustomerMapper.toDomain(customer)
  }

  async save(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)
    await this.prisma.customer.create({
      data,
    })
  }

  async count(params: FetchCustomersSearchParams): Promise<number> {
    const where: Prisma.CustomerWhereInput = this.buildSearchWhere(params)
    return this.prisma.customer.count({ where })
  }
}
