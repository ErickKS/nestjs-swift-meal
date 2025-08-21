import { Item } from '@/domain/item/item'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { ItemRepository } from '../repositories/item-repository'

interface GetItemByIdInput {
  itemId: string
}

interface GetItemByIdOutput {
  item: Item
}

@Injectable()
export class GetItemByIdUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  @Span(({ itemId }) => ({ attributes: { itemId } }))
  async execute({ itemId }: GetItemByIdInput): Promise<GetItemByIdOutput> {
    const item = await this.itemRepository.findById(itemId)
    if (!item) throw new Error('Item not found')
    return {
      item,
    }
  }
}
