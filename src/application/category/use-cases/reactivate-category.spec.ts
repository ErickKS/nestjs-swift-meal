import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { ReactivateCategoryUseCase } from './reactivate-category'

let categoryRepository: InMemoryCategoryRepository
let sut: ReactivateCategoryUseCase

describe('Reactivate Category Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new ReactivateCategoryUseCase(categoryRepository)
  })

  it('should reactivate a deleted category', async () => {
    const categoryId = 'category-1'
    const newCategory = makeCategory({ deletedAt: new Date() }, categoryId)
    await categoryRepository.save(newCategory)
    const input = { categoryId }
    const result = await sut.execute(input)
    expect(categoryRepository.categories[0].deletedAt).toBe(null)
  })

  it('should not reactivate a already active category', async () => {
    const input = { categoryId: 'category-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Category not found')
  })

  it('should not reactivate a already active category', async () => {
    const categoryId = 'category-1'
    const newCategory = makeCategory({}, categoryId)
    await categoryRepository.save(newCategory)
    const input = { categoryId }
    await expect(sut.execute(input)).rejects.toThrowError('Category not deleted')
  })
})
