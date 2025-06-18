import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { SetOrderStatusToReturnedUseCase } from './set-order-status-to-returned'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeCourier } from 'test/factories/make-courier'
import { makeOrder } from 'test/factories/make-order'
import { Status } from '@/domain/delivery/enterprise/entities/value-object.ts/Status'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

let sut: SetOrderStatusToReturnedUseCase
let inMemoryOrdersRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository

describe('Set order status to Returned', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientRepository)
    sut = new SetOrderStatusToReturnedUseCase(inMemoryOrdersRepository)
  })

  it('should be able to change order status to Returned', async () => {
    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PICKED_UP
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString()
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].status).toBe(Status.RETURNED)
  })

  it('should not be able to change order status if the current status is not Picked Up', async () => {
    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
      status: Status.PENDING
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString()
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(SetOrderStatusError)
  })

})