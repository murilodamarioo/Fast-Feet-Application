import { GetOrderDetailsUseCase } from './get-order-details'

import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeCourier } from 'test/factories/make-courier'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { InMemoryOrderPhotosRepository } from 'test/repositories/in-memory-order-photos-repository'

let sut: GetOrderDetailsUseCase
let inMemoryRecipientReposiotry: InMemoryRecipientRepository
let inMemoryOrderPhotosRepository: InMemoryOrderPhotosRepository
let inMemoryOrdersRepository: InMemoryOrderRepository

describe('Get Order', () => {

  beforeEach(() => {
    inMemoryRecipientReposiotry = new InMemoryRecipientRepository()
    inMemoryOrderPhotosRepository = new InMemoryOrderPhotosRepository()
    inMemoryOrdersRepository = new InMemoryOrderRepository(inMemoryRecipientReposiotry, inMemoryOrderPhotosRepository)
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

})