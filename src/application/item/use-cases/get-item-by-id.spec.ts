import { makeItem } from 'test/factories/make-item'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { GetItemByIdUseCase } from './get-item-by-id'

let itemRepository: InMemoryItemRepository
let sut: GetItemByIdUseCase

describe('Get Item By Id Use Case', () => {
  beforeEach(() => {
    itemRepository = new InMemoryItemRepository()
    sut = new GetItemByIdUseCase(itemRepository)
  })

  it('should return the item if it exists', async () => {
    const item = makeItem({}, 'item-1')
    await itemRepository.save(item)
    const result = await sut.execute({ itemId: 'item-1' })
    expect(result.item).toEqual(item)
  })

  it('should throw if item does not exist', async () => {
    await expect(() => sut.execute({ itemId: 'non-existent-id' })).rejects.toThrowError('Item not found')
  })
})
