import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { GetOrderDetailsUseCase } from './get-order-details'
import { makeOrder } from 'test/factories/make-order'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let sut: GetOrderDetailsUseCase
let inMemoryRecipientReposiotry: InMemoryRecipientRepository
let inMemoryOrdersRepository: InMemoryOrderRepository

describe('Get Order', () => {

  beforeEach(() => {
    inMemoryRecipientReposiotry = new InMemoryRecipientRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientReposiotry)
    sut = new GetOrderDetailsUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get order details', async () => {

    const recipient = makeRecipient({
      name: 'John Doe',
      address: '123 Main St',
      neighborhood: 'Downtown',
    })
    inMemoryRecipientReposiotry.recipients.push(recipient)

    const courier = makeCourier()

    const order = makeOrder({
      orderName: '01',
      courierId: courier.id,
      recipientId: recipient.id,
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      courierId: courier.id.toString(),
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      order: expect.objectContaining({
        props: expect.objectContaining({
          recipient: 'John Doe',
          address: '123 Main St',
          neighborhood: 'Downtown'
        })
      })
    })
  })

  it('should not be able to get a order with invalid courier ID', async () => {
    const recipient = makeRecipient({
      name: 'John Doe',
      address: '123 Main St',
      neighborhood: 'Downtown',
    })
    inMemoryRecipientReposiotry.recipients.push(recipient)

    const courier = makeCourier()

    const order = makeOrder({
      courierId: courier.id,
      recipientId: recipient.id,
    })
    inMemoryOrdersRepository.orders.push(order)

    const response = await sut.execute({
      orderId: order.id.toString(),
      courierId: 'invalid-courier-id',
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(NotAllowedError)
  })

})