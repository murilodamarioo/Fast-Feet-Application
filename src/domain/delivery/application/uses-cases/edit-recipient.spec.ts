import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { EditRecipientUseCase } from './edit-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

let sut: EditRecipientUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository

describe('Edit Recipient', () => {

  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to edit a recipient by ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const response = await sut.execute({
      recipientId: recipient.id.toString(),
      name: 'John Doe',
      cpf: recipient.cpf,
      email: recipient.email,
      phone: recipient.phone,
      zipCode: recipient.zipCode,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      state: recipient.state
    })

    expect(response.isSuccess()).toBeTruthy()
    expect(response.value).toMatchObject({
      recipient: expect.objectContaining({
        name: 'John Doe'
      })
    })
  })

  it('should not be able to edit a recipient with an invalid ID', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const response = await sut.execute({
      recipientId: 'invalid-id',
      name: 'John Doe',
      cpf: recipient.cpf,
      email: recipient.email,
      phone: recipient.phone,
      zipCode: recipient.zipCode,
      address: recipient.address,
      neighborhood: recipient.neighborhood,
      state: recipient.state
    })

    expect(response.isFailure()).toBeTruthy()
    expect(response.value).toBeInstanceOf(RecipientNotFoundError)
  })
})