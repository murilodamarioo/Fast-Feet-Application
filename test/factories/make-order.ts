import { Injectable } from '@nestjs/common'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/Order'
import { faker } from '@faker-js/faker'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'

export function makeOrder(override: Partial<OrderProps> = {}, id?: UniqueEntityId) {
  const courier = Order.create({
    recipientId: new UniqueEntityId(),
    courierId: new UniqueEntityId(),
    orderName: override.orderName ?? faker.commerce.productName(),
    postedAt: override.postedAt ?? null,
    pickedUp: override.pickedUp ?? null,
    deliveredAt: override.deliveredAt ?? null,
    ...override
  }, id)

  return courier
}

@Injectable()
export class OrderFactory {

  constructor(private prisma: PrismaService) { }

  async makePrismaOrder(data: Partial<OrderProps> = {}) {
    const order = makeOrder(data)

    const response = await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order)
    })

    return response
  }
}