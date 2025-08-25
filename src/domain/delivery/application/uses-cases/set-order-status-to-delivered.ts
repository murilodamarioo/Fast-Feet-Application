import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { getDistanceBetweenCoordinates } from '@/core/utils/get-distance-between-coordinates'
import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'
import { PhotoNotProvidedError } from '@/core/errors/errors/photo-not-provided-error'

import { Status, StatusUtils } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { OrderPhoto } from '@/domain/delivery/enterprise/entities/Order-Photo'
import { OrderDeliveryDistanceTooFarError } from '@/core/errors/errors/order-delivery-distance-too-far-error'

import { RecipientsRepository } from '../repositories/recipients-repository'
import { OrdersRepository } from '../repositories/orders-repository'

export interface SetOrderStatusToDeliveredUseCaseRequest {
  orderId: string
  photoId: string
  orderLatitude: number
  orderLongitude: number
}

type SetOrderStatusToDeliveredUseCaseResponse = Either<
  OrderNotFoundError | SetOrderStatusError | PhotoNotProvidedError,
  null
>

@Injectable()
export class SetOrderStatusToDeliveredUseCase {

  constructor(
    private ordersRepository: OrdersRepository,
    private recipientRepository: RecipientsRepository
  ) { }

  async execute(
    { orderId, photoId, orderLatitude, orderLongitude }: SetOrderStatusToDeliveredUseCaseRequest
  ): Promise<SetOrderStatusToDeliveredUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return failure(new OrderNotFoundError())
    }

    if (!StatusUtils.isPickedUp(order.status)) {
      return failure(new SetOrderStatusError(order.status, Status.DELIVERED))
    }

    const recipient = await this.recipientRepository.findById(order.recipientId.toString())

    const distance = getDistanceBetweenCoordinates(
      { latitude: orderLatitude, longitude: orderLongitude },
      { latitude: recipient?.latitude, longitude: recipient?.longitude }
    )

    const MAX_DISTANCE_IN_KILOMETERS = 0.01

    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      return failure(new OrderDeliveryDistanceTooFarError())
    }

    if (photoId === '' || photoId === undefined || photoId === null) {
      return failure(new PhotoNotProvidedError())
    }

    const photoAttachment = OrderPhoto.create({
      orderId: order.id,
      photoId: new UniqueEntityId(photoId)
    })

    order.status = Status.DELIVERED
    order.photo = photoAttachment

    await this.ordersRepository.updateStatus(order)

    return success(null)
  }
}