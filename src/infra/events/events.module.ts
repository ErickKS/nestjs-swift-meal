import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { EventDispatcherService } from './event.dispatcher.service'
import { OnOrderCreatedPaymentSubscriber } from '@/application/payment/subscribers/on-order-created'
import { CreatePaymentUseCase } from '@/application/payment/use-cases/create-payment'

@Module({
  imports: [DatabaseModule],
  providers: [
    EventDispatcherService,

    OnOrderCreatedPaymentSubscriber,
    // OnPaymentUpdatedOrderSubscriber,

    CreatePaymentUseCase,
    // UpdateOrderStatusByPaymentStatusUseCase,
  ],
})
export class EventsModule {}
