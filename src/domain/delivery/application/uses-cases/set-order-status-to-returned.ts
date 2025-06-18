import { Either, failure, success } from '@/core/either'
import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'
import { OrdersRepository } from '../repositories/orders-repository'
import { Status, StatusUtils } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

export interface SetOrderStatusToReturnedRequest {
  orderId: string
}

type SetOrderStatusToReturnedResponse = Either<OrderNotFoundError | SetOrderStatusError, null>

export class SetOrderStatusToReturnedUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute(
    { orderId }: SetOrderStatusToReturnedRequest
  ): Promise<SetOrderStatusToReturnedResponse> {

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new OrderNotFoundError())
    }

    if (!StatusUtils.isPickedUp(order.status)) {
      return failure(new SetOrderStatusError(order.status, Status.RETURNED))
    }

    order.status = Status.RETURNED

    await this.ordersRepository.updateStatus(order)

    return success(null)
  }
}