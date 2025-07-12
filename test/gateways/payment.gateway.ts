import { CreatePIXPaymentOutput, PaymentGateway } from '@/application/payment/gateways/payment-gateway'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FakePaymentGateway extends PaymentGateway {
  async createPIXPayment(orderId: string, amount: number): Promise<CreatePIXPaymentOutput> {
    return {
      externalId: `fake-${orderId}`,
      qrCode: `pix://fake-payment/${orderId}`,
      qrCodeBase64: 'data:image/png;base64,fakebase64qr==',
      status: 'PENDING',
    }
  }
}
