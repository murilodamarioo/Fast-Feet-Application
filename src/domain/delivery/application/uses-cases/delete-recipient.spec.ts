import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

let sut: DeleteRecipientUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository

describe('Delete Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to delete a recipient by ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    expect(inMemoryRecipientRepository.recipients.length).toBe(1)

    const response = await sut.execute({
      recipientId: recipient.id.toString()
    })

    expect(response.isSuccess()).toBe(true)
    expect(response.value).toBeNull()
    expect(inMemoryRecipientRepository.recipients.length).toBe(0)
  })

  it('should not be able to delete a recipient with an invalid ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    expect(inMemoryRecipientRepository.recipients).toHaveLength(1)

    const response = await sut.execute({
      recipientId: 'invalid-id'
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(RecipientNotFoundError)
  })
})