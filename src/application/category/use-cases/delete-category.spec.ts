import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { DeleteCategoryUseCase } from './delete-category'

let categoryRepository: InMemoryCategoryRepository
let sut: DeleteCategoryUseCase

describe('Delete Category Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new DeleteCategoryUseCase(categoryRepository)
  })

  it('should delete a category', async () => {
    const categoryId = 'category-1'
    const newCategory = makeCategory({}, categoryId)
    await categoryRepository.save(newCategory)
    const input = { categoryId }
    const result = await sut.execute(input)
    expect(categoryRepository.categories[0].deletedAt).toBeDefined()
  })

  it('should not delete a already deleted category', async () => {
    const input = { categoryId: 'category-1' }
    await expect(sut.execute(input)).rejects.toThrowError('Category not found')
  })

  it('should not delete a already deleted category', async () => {
    const categoryId = 'category-1'
    const newCategory = makeCategory({ deletedAt: new Date() }, categoryId)
    await categoryRepository.save(newCategory)
    const input = { categoryId }
    await expect(sut.execute(input)).rejects.toThrowError('Category already deleted')
  })
})
