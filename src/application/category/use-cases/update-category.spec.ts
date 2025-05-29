import { Category } from '@/domain/category/category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { UpdateCategoryUseCase } from './update-category'

let categoryRepository: InMemoryCategoryRepository
let sut: UpdateCategoryUseCase

describe('Update Category Use Case', () => {
  beforeEach(() => {
    categoryRepository = new InMemoryCategoryRepository()
    sut = new UpdateCategoryUseCase(categoryRepository)
  })

  it('should update a category', async () => {
    const newCategory = Category.create(
      {
        name: 'Category 1',
      },
      'category-1'
    )
    await categoryRepository.save(newCategory)
    const input = {
      categoryId: 'category-1',
      name: 'Category X',
    }
    const result = await sut.execute(input)
    expect(result.category.name).toBe('Category X')
    expect(result.category.updatedAt).not.toBe(result.category.createdAt)
  })

  it('should not update a category with existing name', async () => {
    const newCategory1 = Category.create(
      {
        name: 'Category X',
      },
      'category-1'
    )
    await categoryRepository.save(newCategory1)
    const newCategory2 = Category.create(
      {
        name: 'Category Y',
      },
      'category-2'
    )
    await categoryRepository.save(newCategory2)
    const input = {
      categoryId: 'category-2',
      name: 'Category X',
    }
    await expect(sut.execute(input)).rejects.toThrowError('Category already exists')
  })
})
