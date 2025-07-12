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
    // OnPaymentUpdatedOrderSubscriber,

    CreatePaymentUseCase,
    // UpdateOrderStatusByPaymentStatusUseCase,
  ],
})
export class EventsModule {}
