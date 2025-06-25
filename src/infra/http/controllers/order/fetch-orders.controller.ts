import { FetchOrdersUseCase } from '@/application/order/use-cases/fetch-orders'
import { OrderItemStatusEnum } from '@/domain/order/value-objects/order-item'
import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { Controller, Get, HttpCode, Query, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiQueryFromZod } from '../../decorators/api-query-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { OrderPresenter } from '../../presenters/order-presenter'

const fetchOrdersQuerySchema = z.object({
  code: z.string().optional(),
  status: z.nativeEnum(OrderStatusEnum).optional().default(OrderStatusEnum.PAYMENT_PENDING),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  page: z.coerce.number().int().positive().optional().default(1),
  perPage: z.coerce.number().int().min(1).max(100).optional().default(20),
})
type FetchOrdersQuerySchema = z.infer<typeof fetchOrdersQuerySchema>

const fetchOrdersResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  perPage: z.number(),
  totalPages: z.number(),
  data: z.array(
    z.object({
      id: z.string().uuid(),
      code: z.string(),
      customerId: z.string().uuid(),
      status: z.nativeEnum(OrderStatusEnum),
      total: z.number(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
      items: z.array(
        z.object({
          itemId: z.string(),
          name: z.string(),
          unitPrice: z.number(),
          quantity: z.number(),
          subtotal: z.number(),
          status: z.nativeEnum(OrderItemStatusEnum),
        })
      ),
    })
  ),
})

@Controller('/orders')
@ApiTags('Orders')
export class FetchOrdersController {
  constructor(private readonly fetchOrders: FetchOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  @FetchOrdersController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ query: fetchOrdersQuerySchema }))
  async handle(@Query() query: FetchOrdersQuerySchema) {
    const result = await this.fetchOrders.execute(query)
    return {
      ...result,
      data: result.data.map(OrderPresenter.toHTTP),
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Fetch orders',
        description: 'This endpoint allows you to fetch orders by filters. The orders are returned in an array.',
      }),
      ApiQueryFromZod(fetchOrdersQuerySchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(fetchOrdersResponseSchema) })
    )
  }
}
