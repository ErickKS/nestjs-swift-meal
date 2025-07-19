import { Injectable } from '@nestjs/common'
import { MercadoPagoWebhookHandler } from '../mercado-pago/mercado-pago-webhook-handler'
import { PaymentWebhookHandler } from './payment-webhook-handler'

@Injectable()
export class PaymentWebhookRouter {
  constructor(private readonly mercadoPago: MercadoPagoWebhookHandler) {}

  route(payload: unknown, headers: Headers): PaymentWebhookHandler {
    if (headers.has('x-mercado-pago-signature')) return this.mercadoPago
    throw new Error('Unknown webhook source')
  }
}
