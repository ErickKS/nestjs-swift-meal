export interface PaymentWebhookHandler {
  handle(payload: unknown, headers: Headers): Promise<void>
}
