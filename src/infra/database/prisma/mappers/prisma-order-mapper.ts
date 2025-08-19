import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status';
import { OrderStatus, Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {

  static toDomain(raw: PrismaOrder): Order {

    const status = raw.status
    let domainStatus: Status

    switch (status) {
      case OrderStatus.CREATED:
        domainStatus = Status.CREATED
        break
      case OrderStatus.PENDING:
        domainStatus = Status.PENDING
        break
      case OrderStatus.PICKED_UP:
        domainStatus = Status.PICKED_UP
        break
      case OrderStatus.DELIVERED:
        domainStatus = Status.DELIVERED
        break
      case OrderStatus.RETURNED:
        domainStatus = Status.RETURNED
        break
      default:
        throw new Error(`Status nao suportado: ${status}`)
    }

    return Order.create({
      orderName: raw.title,
      recipientId: new UniqueEntityId(raw.recipientId),
      courierId: new UniqueEntityId(raw.courierId),
      status: domainStatus,
      postedAt: null,
      pickedUp: null,
      deliveredAt: null
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(data: Order): Prisma.OrderUncheckedCreateInput {
    const status = data.status;
    let orderStatus: OrderStatus

    switch (status) {
      case Status.CREATED:
        orderStatus = OrderStatus.CREATED;
        break;
      case Status.PENDING:
        orderStatus = OrderStatus.PENDING;
        break;
      case Status.PICKED_UP:
        orderStatus = OrderStatus.PICKED_UP;
        break;
      case Status.DELIVERED:
        orderStatus = OrderStatus.DELIVERED;
        break;
      case Status.RETURNED:
        orderStatus = OrderStatus.RETURNED;
        break;
      default:
        throw new Error(`Status não suportado: ${status}`);
    }

    return {
      id: data.id.toString(),
      title: data.orderName,
      recipientId: data.recipientId.toString(),
      courierId: data.courierId?.toString(),
      status: orderStatus
    }
  }

}