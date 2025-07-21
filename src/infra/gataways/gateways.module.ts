import { PaymentGateway } from '@/application/payment/gateways/payment-gateway'
import { UpdatePaymentStatusUseCase } from '@/application/payment/use-cases/update-payment-status'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { EnvModule } from '../env/env.module'
import { MercadoPagoWebhookHandler } from './payment/mercado-pago/mercado-pago-webhook-handler'
import { MercadoPagoGateway } from './payment/mercado-pago/mercado-pago.gateway'
import { MercadoPagoService } from './payment/mercado-pago/mercado-pago.service'
import { PaymentWebhookRouter } from './payment/webhook/payment-webhook-router'

@Module({
  imports: [DatabaseModule, EnvModule],
  providers: [
    MercadoPagoService,
    MercadoPagoWebhookHandler,
    PaymentWebhookRouter,
    {
      provide: PaymentGateway,
      useClass: MercadoPagoGateway,
    },
    UpdatePaymentStatusUseCase,
  ],
  exports: [MercadoPagoService, PaymentGateway, PaymentWebhookRouter],
})
export class GatewaysModule {}
