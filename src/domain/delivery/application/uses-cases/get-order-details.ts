import { OrdersRepository } from '../repositories/orders-repository'
import { Either, failure, success } from '@/core/either'
import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'

export interface GetOrderDetailsUseCaseRequest {
  orderId: string
  courierId: string
}

type GetOrderDetailsUseCaseResponse = Either<OrderNotFoundError | NotAllowedError, { order: OrderDetails }>

export class GetOrderDetailsUseCase {

  constructor(private ordersRepository: OrdersRepository) {}

  async execute({ orderId, courierId }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const order = await this.ordersRepository.findOrderDetailsById(orderId)

    if (!order) {
      return failure(new OrderNotFoundError())
    }

    if (order.courierId.toString() !== courierId) {
      return failure(new NotAllowedError())
    }

    return success({ order })
  }

}