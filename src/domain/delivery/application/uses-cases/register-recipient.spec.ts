import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository'
import { RegisterRecipientUseCase } from './register-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { RecipientAlreadyExistsError } from '@/core/errors/errors/recipient-already-exists-error'

let sut: RegisterRecipientUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository

describe('Register Recipient', () => {
  
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new RegisterRecipientUseCase(inMemoryRecipientRepository)
  })
  
  it('should be able to register a new recipient', async () =>  {
    const recipient = makeRecipient({
      address: 'Avenida Paulista, 1578',
      neighborhood: 'Bela Vista',
      zipCode: '01311-000',
      state: 'SP',
    })

    const response = await sut.execute(recipient)

    expect(response.isSuccess()).toBe(true)
    expect(inMemoryRecipientRepository.recipients).toHaveLength(1)
  })

  it('should not be able to register a recipient with the same email', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const response = await sut.execute(recipient)

    expect(response.isFailure()).toBe(true)
    expect(response.value).toBeInstanceOf(RecipientAlreadyExistsError)
  })
})