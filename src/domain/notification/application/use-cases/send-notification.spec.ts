import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

let sut: SendNotificationUseCase
let inMemoryNotificationsRepository: InMemoryNotificationsRepository

describe('Send Notification', () => {
  
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  })

  it('should be able to send a notification', async () => {
    const response = await sut.execute({
      recipientId: 'recipient-1',
      title: 'Notification Title',
      content: 'Notification Content',
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryNotificationsRepository.notifications[0].content).toEqual('Notification Content')
  })
})