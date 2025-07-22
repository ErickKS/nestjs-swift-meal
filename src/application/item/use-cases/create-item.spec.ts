import { Item } from '@/domain/item/item'
import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { CreateItemUseCase } from './create-item'

let itemRepository: InMemoryItemRepository
let categoryRepository: InMemoryCategoryRepository
let sut: CreateItemUseCase

describe('Create Item Use Case', () => {
  beforeEach(() => {
    itemRepository = new InMemoryItemRepository()
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CreateItemUseCase(itemRepository, categoryRepository)
  })

  it('should create an item', async () => {
    const newCategory = makeCategory({}, 'category-1')
    await categoryRepository.save(newCategory)
    const input = {
      code: 'code-1',
      name: 'Item 1',
      description: 'Description',
      price: 25.9,
      categoryId: 'category-1',
    }
    await sut.execute(input)
    expect(itemRepository.items).toHaveLength(1)
    expect(itemRepository.items[0].code).toBe('code-1')
    expect(itemRepository.items[0].name).toBe('Item 1')
    expect(itemRepository.items[0].description).toBe('Description')
    expect(itemRepository.items[0].price).toBe(25.9)
    expect(itemRepository.items[0].active).toBe(true)
    expect(itemRepository.items[0].categoryId).toBe('category-1')
  })

  it('should throw if an item with the same code already exists', async () => {
    const input = {
      code: 'cod-1',
      name: 'Item 1',
      description: 'Description',
      price: 25.9,
      categoryId: 'category-1',
    }
    const newItem = Item.create(input)
    await itemRepository.save(newItem)
    await expect(sut.execute(input)).rejects.toThrowError(`Item with code '${input.code}' already exists`)
  })

  it('should throw if the category does not exist', async () => {
    const input = {
      code: 'cod-1',
      name: 'Item 1',
      description: 'Description',
      price: 25.9,
      categoryId: 'category-1',
    }
    await expect(sut.execute(input)).rejects.toThrowError('Category not found')
  })
})
