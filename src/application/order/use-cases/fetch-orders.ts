import { Order } from '@/domain/order/order'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { PaginationOuput } from '@/shared/kernel/@types/pagination-output'
import { Injectable } from '@nestjs/common'
import { FetchOrdersSearchParams } from '../@types/fetch-orders-search-filters'
import { OrderRepository } from '../repositories/order-repository'

@Injectable()
export class FetchOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Span()
  async execute(input: FetchOrdersSearchParams): Promise<PaginationOuput<Order>> {
    const [orders, total] = await Promise.all([this.orderRepository.findMany(input), this.orderRepository.count(input)])
    const page = input.page ?? 1
    const perPage = input.perPage ?? 10
    const totalPages = Math.ceil(total / perPage)
    return {
      total,
      page,
      perPage,
      totalPages,
      data: orders,
    }
  }
}
