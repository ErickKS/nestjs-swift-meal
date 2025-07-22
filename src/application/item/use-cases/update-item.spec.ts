import { makeCategory } from 'test/factories/make-category'
import { makeItem } from 'test/factories/make-item'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { sleep } from 'test/utils/sleep'
import { UpdateItemUseCase } from './update-item'

let itemRepository: InMemoryItemRepository
let categoryRepository: InMemoryCategoryRepository
let sut: UpdateItemUseCase

describe('Update Item Use Case', () => {
  beforeEach(() => {
    itemRepository = new InMemoryItemRepository()
    categoryRepository = new InMemoryCategoryRepository()
    sut = new UpdateItemUseCase(itemRepository, categoryRepository)
  })

  it('should update an item', async () => {
    await categoryRepository.save(makeCategory({}, 'cat-2'))
    await itemRepository.save(
      makeItem(
        {
          name: 'Item 1',
          description: 'Description 1',
          price: 10,
        },
        'item-1'
      )
    )
    await sleep(10)
    const input = {
      itemId: 'item-1',
      name: 'Item Test',
      description: 'Description Test',
      active: false,
      price: 19,
      categoryId: 'cat-2',
    }
    await sut.execute(input)
    expect(itemRepository.items[0].name).toBe('Item Test')
    expect(itemRepository.items[0].description).toBe('Description Test')
    expect(itemRepository.items[0].price).toBe(19)
    expect(itemRepository.items[0].categoryId).toBe('cat-2')
    expect(itemRepository.items[0].active).toBe(false)
    expect(itemRepository.items[0].updatedAt).not.toEqual(itemRepository.items[0].createdAt)
  })

  it('should reactivate item if active is true', async () => {
    const item = makeItem({ active: false }, 'item-1')
    await itemRepository.save(item)
    await sut.execute({ itemId: 'item-1', active: true })
    expect(itemRepository.items[0].active).toBe(true)
    expect(itemRepository.items[0].isAvailable()).toBe(true)
  })

  it('should throw if item does not exist', async () => {
    await expect(() =>
      sut.execute({
        itemId: 'non-existent',
        name: 'Test',
      })
    ).rejects.toThrowError('Item not found')
  })

  it('should throw if category does not exist', async () => {
    const item = makeItem({}, 'item-1')
    await itemRepository.save(item)
    await expect(() =>
      sut.execute({
        itemId: 'item-1',
        categoryId: 'invalid-cat',
      })
    ).rejects.toThrowError('Category not found')
  })

  it('should throw when trying to update a deleted item', async () => {
    const item = makeItem({ deletedAt: new Date() }, 'item-1')
    await itemRepository.save(item)
    await expect(() =>
      sut.execute({
        itemId: 'item-1',
        name: 'test',
      })
    ).rejects.toThrowError('Cannot update a deleted item')
  })
})
