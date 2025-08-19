import { Customer } from '@/domain/customer/customer'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { CustomerRepository } from '../repositories/customer-repository'

interface CreateCustomerInput {
  name: string
  document: string
  email: string
}

@Injectable()
export class CreateCustomerUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  @Span()
  async execute(input: CreateCustomerInput): Promise<void> {
    const customerExistsByDocument = await this.customerRepository.existsByDocument(input.document)
    const customerExistsByEmail = await this.customerRepository.existsByEmail(input.email)
    if (customerExistsByDocument) throw new Error('Customer with this document already exists')
    if (customerExistsByEmail) throw new Error('Customer with this email already exists')
    const customer = Customer.create(input)
    await this.customerRepository.save(customer)
  }
}
