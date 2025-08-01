import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { MercadoPagoConfig, Payment } from 'mercadopago'

@Injectable()
export class MercadoPagoService {
  private _payment: Payment

  constructor(private readonly env: EnvService) {
    const accessToken = this.env.get('MERCADO_PAGO_ACCESS_TOKEN')
    const sdk = new MercadoPagoConfig({ accessToken })
    this._payment = new Payment(sdk)
  }

  payment(): Payment {
    return this._payment
  }
}
