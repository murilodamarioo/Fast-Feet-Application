import { Either, failure, success } from '@/core/either'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { OrdersRepository } from '../repositories/orders-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

export interface CreateOrderUseCaseRequest {
  recipientId: string
  courierId: string
  orderName: string
}

type CreateOrderUseCaseResponse = Either<RecipientNotFoundError, { order: Order }>

@Injectable()
export class CreateOrderUseCase {

  constructor(
    private ordersrepository: OrdersRepository,
    private recipientsRepository: RecipientsRepository
  ) {}

  async execute({ recipientId, courierId, orderName }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new RecipientNotFoundError())
    }

    const order = Order.create({
      recipientId: new UniqueEntityId(recipientId),
      courierId: new UniqueEntityId(courierId),
      orderName,
      postedAt: null,
      pickedUp: null,
      deliveredAt: null
    });

    await this.ordersrepository.create(order)

    return success({ order })
  }
}