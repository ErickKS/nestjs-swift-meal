import { GetPaymentByOrderIdUseCase } from '@/application/payment/use-cases/get-payment-by-order-id'
import { PaymentStatusEnum } from '@/domain/payment/value-objects/payment-status'
import { Controller, Get, HttpCode, Param, UnprocessableEntityException, UsePipes, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'
import { ApiParamFromZod } from '../../decorators/api-param-from-zod.decorator'
import { ZodRequestValidationPipe } from '../../pipes/zod-request-validation-pipe'
import { PaymentPresenter } from '../../presenters/payment-presenter'

const getPaymentByIdParamsSchema = z.object({
  orderId: z.string().uuid(),
})
type GetPaymentByIdParamsSchema = z.infer<typeof getPaymentByIdParamsSchema>

const getPaymentByIdResponseSchema = z.object({
  payment: z.object({
    status: z.nativeEnum(PaymentStatusEnum),
    amount: z.number(),
    qrCode: z.string(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  }),
})

@Controller('/payments/orders/:orderId')
@ApiTags('Payments')
export class GetPaymentByOrderIdController {
  constructor(private readonly getPaymentByOrderId: GetPaymentByOrderIdUseCase) {}

  @Get()
  @HttpCode(200)
  @GetPaymentByOrderIdController.swagger()
  @UsePipes(
    new ZodRequestValidationPipe({
      param: getPaymentByIdParamsSchema,
    })
  )
  async handle(@Param() param: GetPaymentByIdParamsSchema) {
    try {
      const result = await this.getPaymentByOrderId.execute(param)
      return {
        payment: PaymentPresenter.toHTTP(result.payment),
      }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Get payment by order id',
        description: 'This endpoint allows you get payment details by order id.',
      }),
      ApiParamFromZod(getPaymentByIdParamsSchema),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(getPaymentByIdResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
