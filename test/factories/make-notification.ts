import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification'
import { faker } from '@faker-js/faker'

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
  const notification = Notification.create({
    recipientId: new UniqueEntityId(),
    title: faker.lorem.sentence(4),
    content: faker.lorem.paragraph(1),
    ...override
  }, id)

  return notification
}