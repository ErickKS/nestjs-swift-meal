import { sleep } from 'test/utils/sleep'
import { Category } from './category'

describe('Category Entity', () => {
  it('should create a category with valid properties', async () => {
    const category = Category.create({ name: 'Test Category' })
    expect(category.id).toBeDefined()
    expect(category.name).toBe('Test Category')
    expect(category.createdAt).toBeDefined()
    expect(category.updatedAt).toBeDefined()
  })

  it('should update the updatedAt when touching the category', async () => {
    const category = Category.create({ name: 'Touch Test' })
    const initialUpdatedAt = category.updatedAt
    await sleep(10)
    category.touch()
    expect(category.updatedAt).not.toEqual(initialUpdatedAt)
  })

  it('should restore a category', async () => {
    const category = Category.restore(
      {
        name: 'Restored Category',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      },
      '12345'
    )
    expect(category.id).toBe('12345')
    expect(category.name).toBe('Restored Category')
    expect(category.createdAt).toEqual(new Date('2023-01-01'))
    expect(category.updatedAt).toEqual(new Date('2023-01-02'))
  })
})
