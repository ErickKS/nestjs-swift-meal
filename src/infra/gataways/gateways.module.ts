import { PaymentGateway } from '@/application/payment/gateways/payment-gateway'
import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { MercadoPagoGateway } from './payment/mercado-pago/mercado-pago.gateway'
import { MercadoPagoService } from './payment/mercado-pago/mercado-pago.service'

@Module({
  imports: [EnvModule],
  providers: [
    MercadoPagoService,
    {
      provide: PaymentGateway,
      useClass: MercadoPagoGateway,
    },
  ],
  exports: [MercadoPagoService, PaymentGateway],
})
export class GatewaysModule {}
