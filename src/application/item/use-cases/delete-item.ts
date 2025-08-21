import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { ItemRepository } from '../repositories/item-repository'

interface DeleteItemInput {
  itemId: string
}

@Injectable()
export class DeleteItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  @Span(({ itemId }) => ({ attributes: { itemId } }))
  async execute({ itemId }: DeleteItemInput): Promise<void> {
    const item = await this.itemRepository.findById(itemId)
    if (!item) throw new Error('Item not found')
    item.softDelete()
    await this.itemRepository.delete(item)
  }
}
