import { CreateCustomerProps, Customer } from '@/domain/customer/customer'
import { PrismaCustomerMapper } from '@/infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { generateDocument } from 'test/utils/generate-document'

export function makeCustomer(override: Partial<CreateCustomerProps> = {}, id?: string) {
  const customer = Customer.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      document: generateDocument(),
      ...override,
    },
    id
  )
  return customer
}

@Injectable()
export class CustomerFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCustomer(data: Partial<CreateCustomerProps> = {}): Promise<Customer> {
    const customer = makeCustomer(data)
    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })
    return customer
  }
}
