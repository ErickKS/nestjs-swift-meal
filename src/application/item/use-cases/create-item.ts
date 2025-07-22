import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { Item } from '@/domain/item/item'
import { Injectable } from '@nestjs/common'
import { ItemRepository } from '../repositories/item-repository'

interface CreateItemInput {
  code: string
  name: string
  description: string
  price: number
  categoryId: string
}

@Injectable()
export class CreateItemUseCase {
  constructor(
    private readonly itemRepository: ItemRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: CreateItemInput): Promise<void> {
    const existingItem = await this.itemRepository.existsByCode(input.code)
    if (existingItem) throw new Error(`Item with code '${input.code}' already exists`)
    const existingCategory = await this.categoryRepository.findById(input.categoryId)
    if (!existingCategory) throw new Error('Category not found')
    const item = Item.create(input)
    await this.itemRepository.save(item)
  }
}
