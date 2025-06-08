import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Injectable } from '@nestjs/common'
import { ItemRepository } from '../repositories/item-repository'

interface UpdateItemInput {
  itemId: string
  name?: string
  description?: string
  price?: number
  active?: boolean
  categoryId?: string
}

@Injectable()
export class UpdateItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute({ itemId, name, description, price, active, categoryId }: UpdateItemInput): Promise<void> {
    const item = await this.itemRepository.findById(itemId)
    if (!item) throw new Error('Item not found')
    if (item.isDeleted()) throw new Error('Cannot update a deleted item')
    if (!item) throw new Error('Item not found')
    if (categoryId) {
      const existingCategory = await this.categoryRepository.findById(categoryId)
      if (!existingCategory) throw new Error('Category not found')
    }
    item.update({
      name,
      description,
      price,
      categoryId,
    })
    if (active === false && item.active) item.deactivate()
    if (active === true && !item.active) item.reactivate()
    await this.itemRepository.update(item)
  }
}
