export interface CreatePIXPaymentOutput {
  externalId: string
  qrCode: string
  qrCodeBase64: string
  status: string
}

export abstract class PaymentGateway {
  abstract createPIXPayment(orderId: string, amount: number): Promise<CreatePIXPaymentOutput>
}
