import { Either, success } from '@/core/either'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface CreateOrderUseCaseRequest {
  recipientId: string
  courierId: string
  orderName: string
}

type CreateOrderUseCaseResponse = Either<null, { order: Order }>

export class CreateOrderUseCase {

  constructor(private orderepository: OrdersRepository) {}

  async execute({ recipientId, courierId, orderName }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      courierId: new UniqueEntityId(courierId),
      orderName,
      postedAt: null,
      pickedUp: null,
      deliveredAt: null
    });

    await this.orderepository.create(order)

    return success({ order })
  }
}