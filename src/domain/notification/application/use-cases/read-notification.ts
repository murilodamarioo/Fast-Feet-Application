import { Either, failure, success } from '@/core/either'
import { NotificationsRepository } from '../repositories/notification-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface ReadNotificationUseCaseRequest {
  notificationId: string
  recipientId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(
    { notificationId, recipientId }: ReadNotificationUseCaseRequest
  ): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return failure(new ResourceNotFoundError())
    }

    if (notification.recipientId.toString() !== recipientId) {
      return failure(new NotAllowedError())
    }

    notification.read()

    await this.notificationsRepository.save(notification)

    return success({ notification })
  }
}