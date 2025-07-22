import { PaymentWebhookRouter } from '@/infra/gataways/payment/webhook/payment-webhook-router'
import { Body, Controller, HttpCode, Post, Req, UnprocessableEntityException, applyDecorators } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { zodToOpenAPI } from 'nestjs-zod'
import { z } from 'zod'

const paymentWebhookResponseSchema = z.object({
  received: z.boolean(),
})

@Controller('/webhook/payments')
@ApiTags('Payments')
export class PaymentWebhook {
  constructor(private readonly paymentWebhookRouter: PaymentWebhookRouter) {}

  @Post()
  @HttpCode(200)
  @PaymentWebhook.swagger()
  async handle(@Req() request: Request, @Body() body: unknown) {
    try {
      const handler = this.paymentWebhookRouter.route(body, request.headers)
      await handler.handle(body, request.headers)
      return { received: true }
    } catch (error) {
      throw new UnprocessableEntityException(error.message)
    }
  }

  private static swagger() {
    return applyDecorators(
      ApiOperation({
        summary: 'Receive payment webhook',
        description: 'Receives payment status updates from external payment gateways.',
      }),
      ApiResponse({ status: 200, description: 'OK', schema: zodToOpenAPI(paymentWebhookResponseSchema) }),
      ApiResponse({ status: 400, description: 'Bad Request' }),
      ApiResponse({ status: 422, description: 'Unprocessable Entity' })
    )
  }
}
