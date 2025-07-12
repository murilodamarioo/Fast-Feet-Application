import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'

let sut: CreateOrderUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository

describe('Create Order', () => {

  beforeAll(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(inMemoryRecipientRepository)
    sut = new CreateOrderUseCase(inMemoryOrderRepository, inMemoryRecipientRepository)
  })

  it('should create an order', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.create(recipient)

    const order = makeOrder({ recipientId: recipient.id })

    const response = await sut.execute({
      recipientId: order.recipientId.toString(),
      courierId: order.courierId.toString(),
      orderName: order.orderName,
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(inMemoryOrderRepository.orders).toHaveLength(1)
  })
})