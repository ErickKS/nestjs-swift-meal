import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { ItemRepository } from '@/application/item/repositories/item-repository'
import { Order } from '@/domain/order/order'
import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../repositories/order-repository'

interface CreateOrderItemInput {
  itemId: string
  quantity: number
}

interface CreateOrderInput {
  customerId?: string
  items: CreateOrderItemInput[]
}

interface CreateOrderOutput {
  order: Order
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly itemRepository: ItemRepository
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    if (input.customerId) {
      const existingCustomer = await this.customerRepository.findById(input.customerId)
      if (!existingCustomer) throw new Error('Customer not found')
    }
    if (!input.items || input.items.length === 0) throw new Error('At least one item is required')
    const enrichedItems = await Promise.all(
      input.items.map(async item => {
        const existingItem = await this.itemRepository.findById(item.itemId)
        if (!existingItem) throw new Error(`Item '${item.itemId}' does not exist`)
        if (!existingItem.active) throw new Error(`Item '${item.itemId}' is not available`)
        return {
          itemId: existingItem.id,
          name: existingItem.name,
          unitPrice: existingItem.price,
          quantity: item.quantity,
        }
      })
    )
    const order = Order.create({
      customerId: input.customerId,
      items: enrichedItems,
    })
    await this.orderRepository.save(order)
    return {
      order,
    }
  }
}
