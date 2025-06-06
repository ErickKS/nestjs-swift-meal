import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { CategoryStatus } from '../@types/fetch-categories-search-filters'
import { FetchCategoriesUseCase } from './fetch-categories'

let categoryRepository: InMemoryCategoryRepository
let sut: FetchCategoriesUseCase

describe('Fetch Categories Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new FetchCategoriesUseCase(categoryRepository)
  })

  it('should fetch all categories ordered by name asc by default', async () => {
    const categoryB = makeCategory({ name: 'Beverages' })
    const categoryA = makeCategory({ name: 'Appetizers' })
    await categoryRepository.save(categoryB)
    await categoryRepository.save(categoryA)
    const result = await sut.execute({})
    expect(result.categories.length).toBe(2)
    expect(result.categories[0].name).toBe('Appetizers')
    expect(result.categories[1].name).toBe('Beverages')
  })

  it('should fetch all categories ordered by name desc', async () => {
    const categoryB = makeCategory({ name: 'Beverages' })
    const categoryA = makeCategory({ name: 'Appetizers' })
    await categoryRepository.save(categoryB)
    await categoryRepository.save(categoryA)
    const result = await sut.execute({ sortOrder: 'desc' })
    expect(result.categories.length).toBe(2)
    expect(result.categories[0].name).toBe('Beverages')
    expect(result.categories[1].name).toBe('Appetizers')
  })

  it('should fetch only active categories when status is active', async () => {
    const inactiveCategory = makeCategory({ name: 'Archived', deletedAt: new Date() })
    const activeCategory = makeCategory({ name: 'Main Dishes' })
    await categoryRepository.save(inactiveCategory)
    await categoryRepository.save(activeCategory)
    const result = await sut.execute({ status: CategoryStatus.ACTIVE })
    expect(result.categories.length).toBe(1)
    expect(result.categories[0].name).toBe('Main Dishes')
  })

  it('should fetch only inactive categories when status is inactive', async () => {
    const inactiveCategory = makeCategory({ name: 'Deprecated', deletedAt: new Date() })
    const activeCategory = makeCategory({ name: 'Starters' })
    await categoryRepository.save(inactiveCategory)
    await categoryRepository.save(activeCategory)
    const result = await sut.execute({ status: CategoryStatus.INACTIVE })
    expect(result.categories.length).toBe(1)
    expect(result.categories[0].name).toBe('Deprecated')
  })

  it('should fetch all categories when status is all', async () => {
    const activeCategory = makeCategory({ name: 'Desserts' })
    const inactiveCategory = makeCategory({ name: 'Old Menu', deletedAt: new Date() })
    await categoryRepository.save(activeCategory)
    await categoryRepository.save(inactiveCategory)
    const result = await sut.execute({ status: CategoryStatus.ALL })
    expect(result.categories.length).toBe(2)
    const names = result.categories.map(c => c.name)
    expect(names).toContain('Desserts')
    expect(names).toContain('Old Menu')
  })

  it('should default to active + asc when no filters are provided', async () => {
    const categoryB = makeCategory({ name: 'B' })
    const categoryA = makeCategory({ name: 'A' })
    const categoryC = makeCategory({ name: 'C', deletedAt: new Date() })
    await categoryRepository.save(categoryB)
    await categoryRepository.save(categoryA)
    await categoryRepository.save(categoryC)
    const result = await sut.execute({})
    expect(result.categories.map(c => c.name)).toEqual(['A', 'B'])
  })
})
