import { OrderStatusEnum } from '@/domain/order/value-objects/order-status/order-status'
import { Span } from '@/infra/observability/decorators/span.decorator'
import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../repositories/order-repository'

interface UpdateOrderStatusInput {
  orderId: string
  status: OrderStatusEnum
}

@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Span(({ orderId }) => ({ attributes: { orderId } }))
  async execute({ orderId, status }: UpdateOrderStatusInput): Promise<void> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Order not found')
    switch (status) {
      case OrderStatusEnum.PAID:
        order.pay()
        break
      case OrderStatusEnum.PREPARING:
        order.prepare()
        break
      case OrderStatusEnum.READY:
        order.ready()
        break
      case OrderStatusEnum.COMPLETED:
        order.complete()
        break
      case OrderStatusEnum.CANCELED:
        order.cancel()
        break
      default:
        throw new Error(`Invalid status transition: ${status}`)
    }
    await this.orderRepository.updateWithoutItems(order)
  }
}
