import { makeItem } from 'test/factories/make-item'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { DeleteItemUseCase } from './delete-item'

let itemRepository: InMemoryItemRepository
let sut: DeleteItemUseCase

describe('Delete Item Use Case', () => {
  beforeEach(() => {
    itemRepository = new InMemoryItemRepository()
    sut = new DeleteItemUseCase(itemRepository)
  })

  it('should delete an item', async () => {
    await itemRepository.save(makeItem({}, 'item-1'))
    const input = { itemId: 'item-1' }
    await sut.execute(input)
    expect(itemRepository.items[0].deletedAt).toBeDefined()
  })

  it('should throw if item does not exist', async () => {
    const input = { itemId: 'item-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Item not found')
  })

  it('should throw when trying delete a deleted item', async () => {
    await itemRepository.save(makeItem({ deletedAt: new Date() }, 'item-1'))
    const input = { itemId: 'item-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Item already deleted')
  })
})
