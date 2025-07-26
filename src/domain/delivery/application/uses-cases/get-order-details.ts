import { OrdersRepository } from '../repositories/orders-repository'
import { Either, failure, success } from '@/core/either'
import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { OrderDetails } from '@/domain/delivery/enterprise/entities/value-object.ts/order-details'
import { Injectable } from '@nestjs/common'

export interface GetOrderDetailsUseCaseRequest {
  orderId: string
}

type GetOrderDetailsUseCaseResponse = Either<OrderNotFoundError, { order: OrderDetails }>

@Injectable()
export class GetOrderDetailsUseCase {

  constructor(private ordersRepository: OrdersRepository) { }

  async execute({ orderId }: GetOrderDetailsUseCaseRequest): Promise<GetOrderDetailsUseCaseResponse> {
    const order = await this.ordersRepository.findOrderDetailsById(orderId)

    if (!order) {
      return failure(new OrderNotFoundError())
    }

    return success({ order })
  }

}