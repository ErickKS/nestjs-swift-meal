import { ItemStatus } from '@/application/item/@types/fetch-items-search-filters'
import { FetchItemsUseCase } from '@/application/item/use-cases/fetch-items'
import { Controller, Get, HttpCode, Query, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { ItemPresenter } from '../../presenters/item-presenter'

const fetchItemsQuerySchema = z.object({
  code: z.string().optional(),
  name: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  status: z.nativeEnum(ItemStatus).optional().default(ItemStatus.ACTIVE),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().min(1).max(100).optional().default(20),
})
type FetchItemsQuerySchema = z.infer<typeof fetchItemsQuerySchema>

const fetchItemsResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      code: z.string(),
      name: z.string(),
      description: z.string(),
      price: z.number(),
      priceInCents: z.number(),
      categoryId: z.string(),
      active: z.boolean(),
      available: z.boolean(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      deletedAt: z.string().datetime().nullable(),
    })
  ),
})

@Controller('/items')
@ApiTags('Items')
export class FetchItemsController {
  constructor(private readonly fetchItems: FetchItemsUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchItemsController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ query: fetchItemsQuerySchema }))
  async handle(@Query() query: FetchItemsQuerySchema) {
    const result = await this.fetchItems.execute(query)
    return {
      ...result,
      data: result.data.map(ItemPresenter.toHTTP),
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Fetch items',
        description: 'This endpoint allows you to fetch items by filters. The items are returned in an array.',
      }),
      ApiQueryFromZod(fetchItemsQuerySchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchItemsResponseSchema) })
    )
  }
}
