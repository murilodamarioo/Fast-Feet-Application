import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { ChangeStatusEvent } from '@/domain/delivery/enterprise/events/change-status-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnStatusChanged implements EventHandler {
  
  constructor(
    private ordersRepository: OrdersRepository,
    private sendNotification:SendNotificationUseCase
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewStatusNotification.bind(this), 
      ChangeStatusEvent.name
    )
  }

  private async sendNewStatusNotification({ order }: ChangeStatusEvent) {
    const foundOrder = await this.ordersRepository.findById(
      order.id.toString()
    )

    if (foundOrder) {
      await this.sendNotification.execute({
        recipientId: foundOrder.recipientId.toString(),
        title: 'The status of your order has changed.',
        content: `Current Status: ${order.status}`
      })
    }
  }
}