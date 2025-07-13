import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {

  static toDomain(raw: PrismaOrder): Order {
    return Order.create({
      orderName: raw.title,
      recipientId: new UniqueEntityId(raw.recipientId),
      courierId: new UniqueEntityId(raw.courierId),
      postedAt: null,
      pickedUp: null,
      deliveredAt: null
    })
  }

  static toPrisma(data: Order): Prisma.OrderUncheckedCreateInput {
    return {
      title: data.orderName,
      recipientId: data.recipientId.toString(),
      courierId: data.courierId?.toString()
    }
  }

}