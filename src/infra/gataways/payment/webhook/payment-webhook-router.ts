import { Injectable } from '@nestjs/common'
import { MercadoPagoWebhookHandler } from '../mercado-pago/mercado-pago-webhook-handler'
import { PaymentWebhookHandler } from './payment-webhook-handler'

@Injectable()
export class PaymentWebhookRouter {
  constructor(private readonly mercadoPago: MercadoPagoWebhookHandler) {}

  route(payload: unknown, headers: Headers): PaymentWebhookHandler {
    const userAgent = headers['user-agent']?.toLowerCase()

    if (userAgent?.includes('mercadopago webhook')) return this.mercadoPago

    throw new Error('Unknown webhook source')
  }
}
