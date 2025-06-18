import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

export class InMemoryNotificationsRepository extends NotificationsRepository {
  
  public notifications: Notification[] = []

   async findById(id: string) {
    const notification = this.notifications.find(
      (notification) => notification.id.toString() === id
    )

    return notification ? notification : null
  }

  async create(notification: Notification): Promise<void> {
    this.notifications.push(notification)
  }

  async save(notification: Notification) {
    const notificationIndex = this.notifications.findIndex(
      (notification) => notification.id === notification.id,
    )

    this.notifications[notificationIndex] = notification
  }

}