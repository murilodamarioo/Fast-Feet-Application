import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'

import { SetOrderStatusToPickedUpUseCase } from './set-order-status-to-picked-up'

import { makeCourier } from 'test/factories/make-courier'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'

let inMemoryCourierReposiotory: InMemoryCourierRepository
let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: SetOrderStatusToPickedUpUseCase

describe('Set order status to Picked Up', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryCourierReposiotory = new InMemoryCourierRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository, inMemoryOrderPhotosRepository)
    sut = new SetOrderStatusToPickedUpUseCase(inMemoryOrdersRepository)
  })

  it('should be able to change order status to Picked Up', async () => {
    const courier = makeCourier()
    inMemoryCourierReposiotory.couriers.push(courier)

    const order = makeOrder({ status: Status.PENDING })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({ orderId: order.id.toString() })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].status).toBe(Status.PICKED_UP)
  })

  it('should not be able to change order status if the current status is not Pending', async () => {
    const courier = makeCourier()
    inMemoryCourierReposiotory.couriers.push(courier)

    const order = makeOrder({
      status: Status.DELIVERED
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({ orderId: order.id.toString() })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(SetOrderStatusError)
  })
})