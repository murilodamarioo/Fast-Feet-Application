import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'

let sut: ReadNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('', () => {
  
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  })


  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    inMemoryNotificationsRepository.create(notification)

    const reponse = await sut.execute({
      notificationId: notification.id.toString(),
      recipientId: notification.recipientId.toString(),
    })

    expect(reponse.isSuccess()).toBeTruthy()
    expect(reponse.value).toMatchObject({
      notification: expect.objectContaining({
        readAt: expect.any(Date)
      })
    })
    expect(inMemoryNotificationsRepository.notifications[0].readAt).toEqual(
      expect.any(Date),
    )
  })
})