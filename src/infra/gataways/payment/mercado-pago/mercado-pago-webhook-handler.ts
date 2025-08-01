import { PaymentGateway } from '@/application/payment/gateways/payment-gateway'
import { UpdatePaymentStatusUseCase } from '@/application/payment/use-cases/update-payment-status'
import { Injectable } from '@nestjs/common'
import { PaymentWebhookHandler } from '../webhook/payment-webhook-handler'

@Injectable()
export class MercadoPagoWebhookHandler implements PaymentWebhookHandler {
  constructor(
    private readonly updatePaymentStatus: UpdatePaymentStatusUseCase,
    private readonly paymentGateway: PaymentGateway
  ) {}

  async handle(payload: any, headers: Headers): Promise<void> {
    const externalId = payload.data.id
    const paymentStatus = await this.paymentGateway.getPaymentStatusByExternalId(externalId)
    await this.updatePaymentStatus.execute({
      externalId,
      status: paymentStatus,
    })
  }
}
