import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParam } from '@/core/repositories/pagination-param'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'

import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'

import { InMemoryOrderPhotosRepository } from './in-memory-order-photos-repository'
import { InMemoryRecipientRepository } from './in-memory-recipient-repository'

export class InMemoryOrderRepository implements OrdersRepository {

  public orders: Order[] = []

  constructor(
    private inMemoryRecipientRepository: InMemoryRecipientRepository,
    private inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
  ) { }

  async findById(id: string): Promise<Order | null> {
    const order = this.orders.find((order) => order.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findOrderDetailsById(id: string): Promise<OrderDetails | null> {
    const order = this.orders.find((order) => order.id.toString() === id)

    if (!order) {
      return null
    }

    const recipient = this.inMemoryRecipientRepository.recipients.find((recipient) => {
      return recipient.id.equals(order.recipientId)
    })


    if (!recipient) {
      throw new Error(`
        Recipient with ID "${order.recipientId.toString()}" does not exist.`
      )
    }

    const orderDetails = OrderDetails.create({
      recipientId: order.recipientId,
      courierId: order.courierId,
      recipient: recipient.name,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      zipCode: recipient.zipCode,
      state: recipient.state,
      status: order.status,
      postedAt: order.postedAt,
      pickedUp: order.pickedUp,
      deliveredAt: order.deliveredAt,
    })

    return orderDetails
  }

  async findManyByStatus(courierId: string, status: string, { page }: PaginationParam): Promise<Order[]> {
    const orders = this.orders
      .filter((order) => order.courierId.toString() === courierId && order.status === status)
      .slice((page - 1) * 10, page * 10)

    return orders
  }

  async create(order: Order): Promise<void> {
    this.orders.push(order)
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.orders.findIndex((item) => {
      return item.id === order.id
    })

    if (order.photo) {
      await this.inMemoryOrderPhotosRepository.create(order.photo)
    }

    this.orders[orderIndex] = order
  }

  async updateStatus(order: Order): Promise<void> {
    const orderIndex = this.orders.findIndex((item) => {
      return item.id === order.id
    })

    if (order.photo) {
      await this.inMemoryOrderPhotosRepository.create(order.photo)
    }

    this.orders[orderIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }
}