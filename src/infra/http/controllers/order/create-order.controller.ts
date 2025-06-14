import { CreateOrderUseCase } from '@/application/order/use-cases/create-order'
import { Body, Controller, HttpCode, Post, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { OrderPresenter } from '../../presenters/order-presenter'

const createOrderItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
})
const createOrderBodySchema = z.object({
  customerId: z.string().uuid().nullable().optional(),
  items: z.array(createOrderItemSchema).min(1),
})

const createOrderResponseSchema = z.object({
  id: z.string().uuid(),
  coode: z.string(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@ApiTags('Orders')
export class CreateOrderController {
  constructor(private readonly createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @CreateOrderController.swagger()
  @UsePipes(new ZodRequestValidationPipe({ body: createOrderBodySchema }))
  async handle(@Body() body: CreateOrderBodySchema) {
    try {
      const { order } = await this.createOrder.execute(body)
      return OrderPresenter.toMinimalHTTP(order)
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Create new order',
        description: 'Creates a new order with one or more items.',
      }),
      ApiBody({ schema: zodToOpenAPI(createOrderBodySchema) }),
      ApiResponse({ status: 201, description: 'Created', schema: zodToOpenAPI(createOrderResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
