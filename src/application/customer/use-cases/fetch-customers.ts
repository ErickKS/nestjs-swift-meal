import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { Customer } from '@/domain/customer/customer'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { PaginationOuput } from '@/shared/kernel/@types/pagination-output'
import { Injectable } from '@nestjs/common'
import { FetchCustomersSearchParams } from '../@types/fetch-custormers-search-filters'

@Injectable()
export class FetchCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  @Span()
  async execute(input: FetchCustomersSearchParams): Promise<PaginationOuput<Customer>> {
    const [customers, total] = await Promise.all([this.customerRepository.findMany(input), this.customerRepository.count(input)])
    const page = input.page ?? 1
    const perPage = input.perPage ?? 10
    const totalPages = Math.ceil(total / perPage)
    return {
      total,
      page,
      perPage,
      totalPages,
      data: customers,
    }
  }
}
