import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { GetRecipientUseCase } from './get-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

let sut: GetRecipientUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository

describe('Get Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to get recipient by ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const response = await sut.execute({
      recipientId: recipient.id.toString()
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toMatchObject({
      recipient: expect.objectContaining({
        name: recipient.name,
        email: recipient.email,
        address: recipient.address,
        phone: recipient.phone,
        state: recipient.state,

      })
    })
  })

  it('should not be able to get recipient with wrong ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const response = await sut.execute({
      recipientId: 'invalid-id'
    })

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(RecipientNotFoundError)
  })

})