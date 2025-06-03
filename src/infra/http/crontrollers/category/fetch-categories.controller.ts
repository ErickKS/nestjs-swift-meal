import { CategoryStatus } from '@/application/category/@types/fetch-categories-search-filters'
import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { Controller, Get, HttpCode, Query, UsePipes } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CategoryPresenter } from '../../presenters/category-presenter'

const fetchCategoriesQuerySchema = z.object({
  status: z.nativeEnum(CategoryStatus).optional().default(CategoryStatus.ACTIVE),
  sortOrder: z.enum(['asc', 'desc']).default('asc').optional(),
})
type FetchCategoriesQuerySchema = z.infer<typeof fetchCategoriesQuerySchema>

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
  @UsePipes(new ZodValidationPipe(fetchCategoriesQuerySchema))
  @ApiQueryFromZod(fetchCategoriesQuerySchema)
  @ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchCategoriesResponseSchema) })
  @ApiOperation({
    summary: 'Fetch all categories',
    description: 'This endpoint allows you to get all categories. The categories are returned in an array.',
  })
  async handle(@Query() query: FetchCategoriesQuerySchema) {
    const result = await this.fetchCategories.execute(query)
    const categories = result.categories
    return {
      categories: categories.map(CategoryPresenter.toHTTP),
    }
  }
}
