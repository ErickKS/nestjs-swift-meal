import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { FetchCategoriesUseCase } from './fetch-categories'

let categoryRepository: InMemoryCategoryRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new FetchCategoriesUseCase(categoryRepository)
  })

  it('should fetch all categories ordered by name', async () => {
    const newCategory1 = makeCategory({ name: '2' })
    await categoryRepository.save(newCategory1)
    const newCategory2 = makeCategory({ name: '1' })
    await categoryRepository.save(newCategory2)
    const result = await sut.execute()
    expect(result.categories.length).toBe(2)
    expect(result.categories[0].name).toBe('1')
    expect(result.categories[1].name).toBe('2')
  })
})
