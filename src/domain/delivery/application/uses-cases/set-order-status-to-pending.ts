import { Either, failure, success } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'
import { Status, StatusUtils } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

export interface SetOrderStatusToPendingUseCaseRequest {
  orderId: string
}

type SetOrderStatusToPendingUseCaseResponse = Either<OrderNotFoundError | SetOrderStatusError, null>

export class SetOrderStatusToPendingUseCase {

  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    { orderId }: SetOrderStatusToPendingUseCaseRequest
  ): Promise<SetOrderStatusToPendingUseCaseResponse> {

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new OrderNotFoundError())
    }

    if (!StatusUtils.isCreated(order.status)) {
      return failure(new SetOrderStatusError(order.status, Status.PENDING))
    }

    order.status = Status.PENDING

    await this.ordersRepository.updateStatus(order)

    return success(null)
  }
}