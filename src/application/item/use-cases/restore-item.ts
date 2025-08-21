import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { ItemRepository } from '../repositories/item-repository'

interface RestoreItemInput {
  itemId: string
}

@Injectable()
export class RestoreItemUseCase {
  constructor(private readonly itemRepository: ItemRepository) {}

  @Span(({ itemId }) => ({ attributes: { itemId } }))
  async execute({ itemId }: RestoreItemInput): Promise<void> {
    const item = await this.itemRepository.findById(itemId)
    if (!item) throw new Error('Item not found')
    item.restoreDeletion()
    await this.itemRepository.update(item)
  }
}
