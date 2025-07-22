import { Customer } from '@/domain/customer/customer'
import { Prisma, Customer as PrismaCustomer } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaCustomer): Customer {
    return Customer.create(
      {
        name: raw.name,
        document: raw.document,
        email: raw.email,
        createdAt: raw.createdAt,
      },
      raw.id
    )
  }

  static toPrisma(Customer: Customer): Prisma.CustomerUncheckedCreateInput {
    return {
      id: Customer.id,
      name: Customer.name,
      document: Customer.document,
      email: Customer.email,
      createdAt: Customer.createdAt,
    }
  }
}
