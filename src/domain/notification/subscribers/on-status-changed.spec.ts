import { makeOrder } from 'test/factories/make-order'
import { OnStatusChanged } from './on-status-changed'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
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
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryRecipientRepository)

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