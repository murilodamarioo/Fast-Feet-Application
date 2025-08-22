import { OrderDeliveryDistanceTooFarError } from '@/core/errors/errors/order-delivery-distance-too-far-error'
import { PhotoNotProvidedError } from '@/core/errors/errors/photo-not-provided-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

import { SetOrderStatusToDeliveredUseCase } from './set-order-status-to-delivered'

import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let sut: SetOrderStatusToDeliveredUseCase

describe('Set order status to delivered', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository, inMemoryOrderPhotosRepository)
    sut = new SetOrderStatusToDeliveredUseCase(inMemoryOrdersRepository, inMemoryRecipientRepository)
  })

  it('should be able to change order status to Delivered', async () => {
    const courier = makeCourier()
    const recipient = makeRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })
    inMemoryRecipientRepository.recipients.push(recipient)

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PICKED_UP,
      recipientId: recipient.id
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      photoId: 'package-photoId',
      orderLatitude: -23.5937123,
      orderLongitude: -46.5802722
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].status).toBe(Status.DELIVERED)
  })

  it('should not be able to change order status if the current status is not Picked Up', async () => {
    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PENDING
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      photoId: 'package-photoId',
      orderLatitude: 40.7128,
      orderLongitude: -74.0060
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(SetOrderStatusError)
  })

  it('should not be able to change order status if photoId is not provided', async () => {
    const courier = makeCourier()
    const recipient = makeRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })
    inMemoryRecipientRepository.recipients.push(recipient)

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PICKED_UP,
      recipientId: recipient.id
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      photoId: '',
      orderLatitude: -23.5937123,
      orderLongitude: -46.5802722
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(PhotoNotProvidedError)
  })

  it('should not be able to change order status if the distance to the recipient is too far', async () => {
    const courier = makeCourier()
    const recipient = makeRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })
    inMemoryRecipientRepository.recipients.push(recipient)

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PICKED_UP,
      recipientId: recipient.id
    })
    inMemoryOrdersRepository.orders.push(order)

    const METERS_AWAY = 0.02
    const response = await sut.execute({
      orderId: order.id.toString(),
      photoId: 'package-photoId',
      orderLatitude: -23.5937123 + METERS_AWAY,
      orderLongitude: -46.5802722 + METERS_AWAY
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(OrderDeliveryDistanceTooFarError)
  })


  it('should persist photo attachment when order is delivered', async () => {
    const courier = makeCourier()

    const recipient = makeRecipient({
      latitude: -23.5937123,
      longitude: -46.5802722
    })
    inMemoryRecipientRepository.recipients.push(recipient)

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PICKED_UP,
      recipientId: recipient.id
    })

    await inMemoryOrdersRepository.create(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      photoId: '1',
      orderLatitude: -23.5937123,
      orderLongitude: -46.5802722
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrderPhotosRepository.orderPhotos).toHaveLength(1)
    expect(inMemoryOrderPhotosRepository.orderPhotos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ photoId: new UniqueEntityId('1') }),
      ])
    )
  })
  
})