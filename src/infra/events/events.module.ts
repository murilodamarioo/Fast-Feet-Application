import { Module } from '@nestjs/common'

import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { OnStatusChanged } from '@/domain/notification/subscribers/on-status-changed'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnStatusChanged,
    SendNotificationUseCase
  ]
})
export class EventsModule { }