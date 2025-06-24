import { UpdateOrderItemUseCase } from '@/application/order/use-cases/update-order-item'
import { OrderItemStatusEnum } from '@/domain/order/value-objects/order-item'
import { Body, Controller, HttpCode, Param, Patch, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'

const updateOrderItemParamsSchema = z.object({
  orderId: z.string().uuid(),
  itemId: z.string().uuid(),
})
type UpdateOrderItemParamsSchema = z.infer<typeof updateOrderItemParamsSchema>

const updateOrderItemBodySchema = z.object({
  quantity: z.number().positive().optional(),
  status: z.nativeEnum(OrderItemStatusEnum).optional(),
})
type UpdateOrderItemBodySchema = z.infer<typeof updateOrderItemBodySchema>

@Controller('/orders/:orderId/items/:itemId')
@ApiTags('Orders')
export class UpdateOrderItemController {
  constructor(private readonly updateOrderItem: UpdateOrderItemUseCase) {}

  @Patch()
  @HttpCode(204)
  @UpdateOrderItemController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: updateOrderItemParamsSchema,
      body: updateOrderItemBodySchema,
    })
  )
  async handle(@Param() param: UpdateOrderItemParamsSchema, @Body() body: UpdateOrderItemBodySchema) {
    const { orderId, itemId } = param
    const { quantity, status } = body
    try {
      await this.updateOrderItem.execute({ orderId, itemId, quantity, status })
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Update order item',
        description: 'This endpoint allows you to update an order item, changing your status or quantity.',
      }),
      ApiParamFromZod(updateOrderItemParamsSchema),
      ApiBody({ schema: zodToOpenAPI(updateOrderItemBodySchema) }),
      ApiResponse({ status: 204, description: 'No Content' }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
