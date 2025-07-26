import { Injectable } from '@nestjs/common'

import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {

  constructor(private prisma: PrismaService, private recipientsRepository: RecipientsRepository) { }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })

    return order ? PrismaOrderMapper.toDomain(order) : null
  }

  async findOrderDetailsById(id: string): Promise<OrderDetails | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id
      }
    })

    if (!order) {
      return null
    }

    const recipient = await this.recipientsRepository.findById(order.recipientId.toString())

    if (!recipient) {
      throw new Error(`
        Recipient with ID "${order.recipientId.toString()}" does not exist.`
      )
    }

    return OrderDetails.create({
      recipientId: new UniqueEntityId(order.recipientId),
      courierId: new UniqueEntityId(order.courierId),
      recipient: recipient.name,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      zipCode: recipient.zipCode,
      state: recipient.state,
      status: order.status,
      postedAt: order.postedAt,
      pickedUp: order.pickedUpAt,
      deliveredAt: order.deliveredAt
    })
  }

  async findManyByStatus(courierId: string, status: string): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data
    })
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: order.id.toString()
      },
      data
    })
  }

  async updateStatus(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: order.id.toString()
      },
      data
    })
  }

}