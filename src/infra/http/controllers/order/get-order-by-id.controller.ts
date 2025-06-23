import { GetOrderByIdUseCase } from '@/application/order/use-cases/get-order-by-id'
import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { Controller, Get, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { OrderPresenter } from '../../presenters/order-presenter'

const getOrderByIdParamsSchema = z.object({
  orderId: z.string().uuid(),
})
type GetOrderByIdParamsSchema = z.infer<typeof getOrderByIdParamsSchema>

const getOrderByIdResponseSchema = z.object({
  order: z.object({
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
      })
    ),
  }),
})

@Controller('/orders/:orderId')
@ApiTags('Orders')
export class GetOrderByIdController {
  constructor(private readonly getOrderById: GetOrderByIdUseCase) {}

  @Get()
  @HttpCode(200)
  @GetOrderByIdController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: getOrderByIdParamsSchema,
    })
  )
  async handle(@Param() param: GetOrderByIdParamsSchema) {
    try {
      const result = await this.getOrderById.execute(param)
      return {
        order: OrderPresenter.toHTTP(result.order),
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get order by id',
        description: 'This endpoint allows you get order details by id.',
      }),
      ApiParamFromZod(getOrderByIdParamsSchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getOrderByIdResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
