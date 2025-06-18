import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/delivery/enterprise/entities/Order'
import { faker } from '@faker-js/faker'

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