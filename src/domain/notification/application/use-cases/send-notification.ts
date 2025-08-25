import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Either, success } from '@/core/either'

import { Notification } from '@/domain/notification/enterprise/entities/notification'

import { NotificationsRepository } from '../repositories/notification-repository'

export interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

export type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>

@Injectable()
export class SendNotificationUseCase {

  constructor(private notificationsRepository: NotificationsRepository) { }

  async execute({ recipientId, title, content }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    })

    await this.notificationsRepository.create(notification)

    return success({ notification })
  }
}