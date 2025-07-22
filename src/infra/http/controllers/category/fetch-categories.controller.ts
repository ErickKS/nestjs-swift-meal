import { CategoryStatus } from '@/application/category/@types/fetch-categories-search-filters'
import { FetchCategoriesUseCase } from '@/application/category/use-cases/fetch-categories'
import { Controller, Get, HttpCode, Query, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
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
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      deletedAt: z.string().datetime(),
    })
  ),
})

@Controller('/categories')
@ApiTags('Categories')
export class FetchCategoriesController {
  constructor(private readonly fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchCategoriesController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ query: fetchCategoriesQuerySchema }))
  async handle(@Query() query: FetchCategoriesQuerySchema) {
    const result = await this.fetchCategories.execute(query)
    const categories = result.categories
    return {
      categories: categories.map(CategoryPresenter.toHTTP),
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Fetch all categories',
        description: 'This endpoint allows you to get all categories. The categories are returned in an array.',
      }),
      ApiQueryFromZod(fetchCategoriesQuerySchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchCategoriesResponseSchema) })
    )
  }
}
