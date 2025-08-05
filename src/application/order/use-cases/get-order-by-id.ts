import { Order } from '@/domain/order/order'
import { Injectable } from '@nestjs/common'
import { Span } from 'nestjs-otel'
import { OrderRepository } from '../repositories/order-repository'

interface GetOrderByIdInput {
  orderId: string
}

interface GetOrderByIdOutput {
  order: Order
}

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  @Span(({ orderId }) => ({ attributes: { orderId } }))
  async execute({ orderId }: GetOrderByIdInput): Promise<GetOrderByIdOutput> {
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Order not found')
    return {
      order,
    }
  }
}
