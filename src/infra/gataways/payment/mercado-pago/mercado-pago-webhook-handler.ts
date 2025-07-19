import { Injectable } from '@nestjs/common'
import { PaymentWebhookHandler } from '../webhook/payment-webhook-handler'

@Injectable()
export class MercadoPagoWebhookHandler implements PaymentWebhookHandler {
  async handle(payload: unknown, headers: Headers): Promise<void> {
    // Validar assinatura
    // Interpretar payload
    // Chamar caso de uso de updatePaymentStatus(paymentId, status)
  }
}
