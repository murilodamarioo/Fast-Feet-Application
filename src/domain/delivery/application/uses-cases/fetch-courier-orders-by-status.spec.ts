import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { FetchCourierOrdersByStatusUseCase } from './fetch-courier-orders-by-status'
import { InMemoryCourierRepository } from 'test/repositories/in-memory-courier-reposiotry'
import { makeCourier } from 'test/factories/make-courier'
import { makeOrder } from 'test/factories/make-order'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { Order } from '@/domain/delivery/enterprise/entities/Order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'

let sut: FetchCourierOrdersByStatusUseCase
let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryCourierRepository: InMemoryCourierRepository

describe('Fetch Orders by Status', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository)
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

    const response = await sut.execute({ courierId: courier.id.toString(), status: Status.DELIVERED })

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

    const response = await sut.execute({ courierId: courier.id.toString(), status: Status.PENDING })

    expect(response.isSuccess()).toBeTruthy()
    if (response.isSuccess()) {
      expect((response.value as { orders: Order[] }).orders).toHaveLength(2)
    }
  })
})