import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Notification, NotificationProps } from '@/domain/notification/enterprise/entities/notification'
import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification-mapper'

import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

export class NotificationFactory {
  constructor(private prisma: PrismaService) { }

  async makePrismaNotification(data: Partial<NotificationProps> = {}): Promise<Notification> {
    const notification = makeNotification(data)

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification)
    })

    return notification
  }
}