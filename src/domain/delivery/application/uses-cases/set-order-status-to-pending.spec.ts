import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { SetOrderStatusToPendingUseCase } from './set-order-status-to-pending'
import { makeCourier } from 'test/factories/make-courier'
import { makeOrder } from 'test/factories/make-order'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: SetOrderStatusToPendingUseCase

describe('Set order status to Pending', () => {
  
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository)
    sut = new SetOrderStatusToPendingUseCase(inMemoryOrdersRepository)
  })

  it('should be able to set order status to Pending', async () => {
    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].status).toBe(Status.PENDING)
  })

  it('should not be able to change order status if the current status is not Created', async () => {
    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
      status: Status.DELIVERED
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString()
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(SetOrderStatusError)
  })
})