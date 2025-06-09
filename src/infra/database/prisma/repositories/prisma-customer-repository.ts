import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { Customer } from '@/domain/customer/customer'
import { Injectable } from '@nestjs/common'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaService) {}

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

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
    })
    if (!customer) return null
    return PrismaCustomerMapper.toDomain(customer)
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
}
