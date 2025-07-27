import { Injectable } from '@nestjs/common'
import { Either, failure, success } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { CouriersRepository } from '../repositories/couriers-repository'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { Order } from '@/domain/delivery/enterprise/entities/Order'

export interface FetchCourierOrdersByStatusUseCaseRequest {
  courierId: string
  status: string
  page: number
}

type FetchCourierOrdersByStatusUseCaseResponse = Either<CourierNotFoundError, { orders: Order[] }>

@Injectable()
export class FetchCourierOrdersByStatusUseCase {

  constructor(
    private ordersRepository: OrdersRepository,
    private couriersRepository: CouriersRepository
  ) { }

  async execute(
    { courierId, status, page }: FetchCourierOrdersByStatusUseCaseRequest
  ): Promise<FetchCourierOrdersByStatusUseCaseResponse> {

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return failure(new CourierNotFoundError())
    }

    const orders = await this.ordersRepository.findManyByStatus(courierId, status, { page })

    return success({ orders })
  }
}