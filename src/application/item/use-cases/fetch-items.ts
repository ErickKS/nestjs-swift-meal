import { Item } from '@/domain/item/item'
import { PaginationOuput } from '@/shared/kernel/@types/pagination-output'
import { Injectable } from '@nestjs/common'
import { Span } from 'nestjs-otel'
import { FetchItemsSearchParams } from '../@types/fetch-items-search-filters'
import { ItemRepository } from '../repositories/item-repository'

@Injectable()
export class FetchItemsUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  @Span()
  async execute(input: FetchItemsSearchParams): Promise<PaginationOuput<Item>> {
    const [items, total] = await Promise.all([this.itemRepository.findMany(input), this.itemRepository.count(input)])
    const page = input.page ?? 1
    const perPage = input.perPage ?? 10
    const totalPages = Math.ceil(total / perPage)
    return {
      total,
      page,
      perPage,
      totalPages,
      data: items,
    }
  }
}
