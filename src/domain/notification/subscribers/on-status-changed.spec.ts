import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { OnStatusChanged } from './on-status-changed'

import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

import { waitFor } from 'test/utils/wait-for'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'
import { makeOrder } from 'test/factories/make-order'

import { MockInstance } from 'vitest'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotification: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  typeof sendNotification.execute
>

describe('On status changed', () => {
  beforeEach(() => {
    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotification = new SendNotificationUseCase(inMemoryNotificationRepository)
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryRecipientRepository, inMemoryOrderPhotosRepository)

    sendNotificationExecuteSpy = vi.spyOn(sendNotification, 'execute')

    new OnStatusChanged(inMemoryOrderRepository, sendNotification)
  })

  it('should send a notification when the status is changed', async () => {
    const order = makeOrder()
    await inMemoryOrderRepository.create(order)

    order.status = Status.PENDING

    await inMemoryOrderRepository.updateStatus(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })

    const [notificationPayload] = sendNotificationExecuteSpy.mock.calls[0]

    expect(notificationPayload).toMatchObject({
      recipientId: order.recipientId.toString(),
      title: 'The status of your order has changed.',
      content: `Current Status: ${order.status}`,
    })
  })
})