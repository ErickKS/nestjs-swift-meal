import { makeItem } from 'test/factories/make-item'
import { InMemoryItemRepository } from 'test/repositories/in-memory-item-repository'
import { RestoreItemUseCase } from './restore-item'

let itemRepository: InMemoryItemRepository
let sut: RestoreItemUseCase

describe('Restore Item Use Case', () => {
  beforeEach(() => {
    itemRepository = new InMemoryItemRepository()
    sut = new RestoreItemUseCase(itemRepository)
  })

  it('should restore a deleted item', async () => {
    await itemRepository.save(makeItem({ deletedAt: new Date() }, 'item-1'))
    const input = { itemId: 'item-1' }
    await sut.execute(input)
    expect(itemRepository.items[0].deletedAt).toBe(null)
  })

  it('should throw if restore a already active item', async () => {
    const input = { itemId: 'item-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Item not found')
  })

  it('should throw if restore a already active item', async () => {
    await itemRepository.save(makeItem({}, 'item-1'))
    const input = { itemId: 'item-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Item is not deleted')
  })
})
