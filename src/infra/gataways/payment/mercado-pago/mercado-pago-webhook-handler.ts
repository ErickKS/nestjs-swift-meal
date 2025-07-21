import { UpdatePaymentStatusUseCase } from '@/application/payment/use-cases/update-payment-status'
import { PaymentStatus } from '@/domain/payment/value-objects/payment-status'
import { Injectable } from '@nestjs/common'
import { PaymentWebhookHandler } from '../webhook/payment-webhook-handler'

@Injectable()
export class MercadoPagoWebhookHandler implements PaymentWebhookHandler {
  constructor(private readonly updatePaymentStatus: UpdatePaymentStatusUseCase) {}

  async handle(payload: any, headers: Headers): Promise<void> {
    const externalId = payload.data.id
    const status = this.mapEventToStatus(payload.action)
    if (!status) throw new Error(`Unhandled MercadoPago event: ${payload.action}`)
    await this.updatePaymentStatus.execute({
      externalId,
      status,
    })
  }

  private mapEventToStatus(event: string): PaymentStatus | null {
    const eventStatusMap = new Map<string, () => PaymentStatus>([
      ['payment.created', PaymentStatus.pending],
      ['payment.updated', PaymentStatus.pending],
      ['payment.in_process', PaymentStatus.pending],
      ['payment.authorized', PaymentStatus.approved],
      ['payment.approved', PaymentStatus.approved],
      ['payment.refunded', PaymentStatus.refunded],
      ['payment.cancelled', PaymentStatus.failed],
      ['payment.rejected', PaymentStatus.failed],
    ])
    const factory = eventStatusMap.get(event.toLowerCase())
    return factory ? factory() : null
  }
}
