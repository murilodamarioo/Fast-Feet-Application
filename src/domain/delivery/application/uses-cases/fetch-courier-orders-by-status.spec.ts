import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { Order } from '@/domain/delivery/enterprise/entities/Order'

import { FetchCourierOrdersByStatusUseCase } from './fetch-courier-orders-by-status'

import { makeOrder } from 'test/factories/make-order'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'

let sut: FetchCourierOrdersByStatusUseCase
let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Fetch Orders by Status', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository, inMemoryOrderPhotosRepository)
    inMemoryCourierRepository = new InMemoryCourierRepository()
    sut = new FetchCourierOrdersByStatusUseCase(inMemoryOrdersRepository, inMemoryCourierRepository)
  })

  it('should be able to fetch orders by DELIVRED status', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const orders = [
      makeOrder({ courierId: courier.id }),
      makeOrder({ courierId: courier.id }),
      makeOrder({ courierId: courier.id, status: Status.DELIVERED }),
      makeOrder(),
      makeOrder(),
    ]

    for (const order of orders) {
      await inMemoryOrdersRepository.create(order)
    }

    const response = await sut.execute({ courierId: courier.id.toString(), status: Status.DELIVERED, page: 1 })

    expect(response.isSuccess()).toBeTruthy()
    if (response.isSuccess()) {
      expect((response.value as { orders: Order[] }).orders).toHaveLength(1)
    }
  })

  it('should be able to fetch orders by PENDING status', async () => {
    const courier = makeCourier()

    await inMemoryCourierRepository.create(courier)

    const orders = [
      makeOrder({ courierId: courier.id, status: Status.PENDING }),
      makeOrder({ courierId: courier.id, status: Status.PENDING }),
      makeOrder({ courierId: courier.id, status: Status.DELIVERED }),
      makeOrder({ courierId: courier.id, status: Status.RETURNED }),
      makeOrder({ courierId: courier.id, status: Status.PICKED_UP }),
    ]

    for (const order of orders) {
      await inMemoryOrdersRepository.create(order)
    }

    const response = await sut.execute({ courierId: courier.id.toString(), status: Status.PENDING, page: 1 })

    expect(response.isSuccess()).toBeTruthy()
    if (response.isSuccess()) {
      expect((response.value as { orders: Order[] }).orders).toHaveLength(2)
    }
  })
})