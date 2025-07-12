import { CreatePIXPaymentOutput, PaymentGateway } from '@/application/payment/gateways/payment-gateway'
import { Injectable } from '@nestjs/common'
import { MercadoPagoService } from './mercado-pago.service'

@Injectable()
export class MercadoPagoGateway implements PaymentGateway {
  constructor(private readonly mercadoPagoService: MercadoPagoService) {}

  async createPIXPayment(orderId: string, amount: number): Promise<CreatePIXPaymentOutput> {
    const response = await this.mercadoPagoService.getPayment().create({
      body: {
        payment_method_id: 'pix',
        description: `Payment for the order '${orderId}'`,
        transaction_amount: amount * 100,
        payer: {
          email: 'comprador@teste.com',
          first_name: 'Comprador',
          last_name: 'Teste',
          identification: {
            type: 'CPF',
            number: '12345678909',
          },
        },
      },
    })

    const transaction = response.point_of_interaction?.transaction_data
    if (!transaction?.qr_code || !transaction.qr_code_base64) {
      throw new Error('QR Code data not found in Mercado Pago response')
    }

    return {
      qrCode: transaction.qr_code,
      qrCodeBase64: transaction.qr_code_base64,
      externalId: String(response.id),
      status: response.status ?? 'PENDING',
    }
  }
}
