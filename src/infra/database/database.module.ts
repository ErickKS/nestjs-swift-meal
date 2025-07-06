import { CategoryRepository } from '@/application/category/repositories/category-repository'
import { CustomerRepository } from '@/application/customer/repositories/customer-repository'
import { ItemRepository } from '@/application/item/repositories/item-repository'
import { OrderRepository } from '@/application/order/repositories/order-repository'
import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { PrismaCustomerRepository } from './prisma/repositories/prisma-customer-repository'
import { PrismaItemRepository } from './prisma/repositories/prisma-item-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { PaymentRepository } from '@/application/payment/repositories/payment-repository'
import { PrismaPaymentRepository } from './prisma/repositories/prisma-payment-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: ItemRepository,
      useClass: PrismaItemRepository,
    },
    {
      provide: CustomerRepository,
      useClass: PrismaCustomerRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PrismaService, CategoryRepository, ItemRepository, CustomerRepository, OrderRepository, PaymentRepository],
})
export class DatabaseModule {}
