import { FetchCustomersUseCase } from '@/application/customer/use-cases/fetch-customers'
import { Controller, Get, HttpCode, Query, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { CustomerPresenter } from '../../presenters/customer-presenter'

const fetchCustomersQuerySchema = z.object({
  name: z.string().optional(),
  document: z.string().min(11).max(11).optional(),
  email: z.string().email().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().min(1).max(100).optional().default(20),
})
type FetchCustomersQuerySchema = z.infer<typeof fetchCustomersQuerySchema>

const fetchCustomersResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      name: z.string(),
      document: z.string(),
      email: z.string(),
      createdAt: z.string().datetime(),
    })
  ),
})

@Controller('/customers')
@ApiTags('Customers')
export class FetchCustomersController {
  constructor(private readonly fetchCustomers: FetchCustomersUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchCustomersController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ query: fetchCustomersQuerySchema }))
  async handle(@Query() query: FetchCustomersQuerySchema) {
    const result = await this.fetchCustomers.execute(query)
    return {
      ...result,
      data: result.data.map(CustomerPresenter.toHTTP),
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Fetch customers',
        description: 'This endpoint allows you to fetch customers by filters. The customers are returned in an array.',
      }),
      ApiQueryFromZod(fetchCustomersQuerySchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchCustomersResponseSchema) })
    )
  }
}
