import { UpdateOrderStatusUseCase } from '@/application/order/use-cases/update-order-status'
import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { Body, Controller, HttpCode, Param, Patch, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const updateOrderStatusParamsSchema = z.object({
  orderId: z.string().uuid(),
})
type UpdateOrderStatusParamsSchema = z.infer<typeof updateOrderStatusParamsSchema>

const updateOrderStatusBodySchema = z.object({
  status: z.nativeEnum(OrderStatusEnum),
})
type UpdateOrderStatusBodySchema = z.infer<typeof updateOrderStatusBodySchema>

@Controller('/orders/:orderId/status')
@ApiTags('Orders')
export class UpdateOrderStatusController {
  constructor(private readonly updateOrderStatus: UpdateOrderStatusUseCase) {}

  @Patch()
  @HttpCode(204)
  @UpdateOrderStatusController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: updateOrderStatusParamsSchema,
      body: updateOrderStatusBodySchema,
    })
  )
  async handle(@Param() param: UpdateOrderStatusParamsSchema, @Body() body: UpdateOrderStatusBodySchema) {
    try {
      await this.updateOrderStatus.execute({ orderId: param.orderId, status: body.status })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Update order status',
        description: 'This endpoint allows you to update an order status.',
      }),
      ApiParamFromZod(updateOrderStatusParamsSchema),
      ApiBody({ schema: zodToOpenAPI(updateOrderStatusBodySchema) }),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
