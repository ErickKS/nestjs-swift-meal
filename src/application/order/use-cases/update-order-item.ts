import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../repositories/order-repository'

interface UpdateOrderItemInput {
  orderId: string
  itemId: string
  status?: string
  quantity?: number
}

@Injectable()
export class UpdateOrderItemUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ orderId, itemId, status, quantity }: UpdateOrderItemInput): Promise<void> {
    if (!quantity && !status) throw new Error('At least one property (quantity or status) must be provided to update the item')
    const order = await this.orderRepository.findById(orderId)
    if (!order) throw new Error('Order not found')
    order.updateItem(itemId, {
      status,
      quantity,
    })
    await this.orderRepository.updateWithItems(order)
  }
}
