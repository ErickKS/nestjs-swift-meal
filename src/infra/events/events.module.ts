import { OnPaymentStatusUpdatedOrderSubscriber } from '@/application/order/subscribers/on-payment-status-updated'
import { UpdateOrderStatusUseCase } from '@/application/order/use-cases/update-order-status'
import { OnOrderCreatedPaymentSubscriber } from '@/application/payment/subscribers/on-order-created'
import { CreatePaymentUseCase } from '@/application/payment/use-cases/create-payment'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { GatewaysModule } from '../gataways/gateways.module'
import { EventDispatcherService } from './event.dispatcher.service'

@Module({
  imports: [DatabaseModule, GatewaysModule],
  providers: [
    EventDispatcherService,

    OnOrderCreatedPaymentSubscriber,
    OnPaymentStatusUpdatedOrderSubscriber,

    CreatePaymentUseCase,
    UpdateOrderStatusUseCase,
  ],
})
export class EventsModule {}
