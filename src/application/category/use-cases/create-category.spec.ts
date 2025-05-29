import { Category } from '@/domain/category/category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { CreateCategoryUseCase } from './create-category'

let categoryRepository: InMemoryCategoryRepository
let sut: CreateCategoryUseCase

describe('Create Category Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new CreateCategoryUseCase(categoryRepository)
  })

  it('should create a category', async () => {
    const input = {
      name: 'Category Name',
    }
    const result = await sut.execute(input)
    expect(result.categoryId).toBeDefined()
    expect(categoryRepository.categories).toHaveLength(1)
    expect(categoryRepository.categories[0].name).toBe('Category Name')
  })

  it('should not create a category with existing name', async () => {
    const input = {
      name: 'Category Name',
    }
    const newCategory = Category.create(input)
    await categoryRepository.save(newCategory)
    await expect(sut.execute(input)).rejects.toThrowError('Category already exists')
  })
})
