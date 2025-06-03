import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { Controller, Get, HttpCode } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { CategoryPresenter } from '../../presenters/category-presenter'

const fetchCategoriesResponseSchema = z.object({
  categories: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
    })
  ),
})

@Controller('/categories')
@ApiTags('Categories')
export class FetchCategoriesController {
  constructor(private readonly fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchCategoriesResponseSchema) })
  @ApiOperation({
    summary: 'Fetch all categories',
    description: 'This endpoint allows you to get all categories. The categories are returned in an array.',
  })
  async handle() {
    const result = await this.fetchCategories.execute()
    const categories = result.categories
    return {
      categories: categories.map(CategoryPresenter.toHTTP),
    }
  }
}
