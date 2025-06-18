import { Either, failure, success } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'

export interface EditRecipientUseCaseRequest {
  recipientId: string
  name: string
  cpf: string
  email: string
  phone: string
  zipCode: string
  address: string
  neighborhood: string
  state: string
}

type EditCourierUseCaseResponse = Either<RecipientNotFoundError, { recipient: Recipient }>

export class EditRecipientUseCase {

  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({ 
    recipientId,
    name,
    cpf,
    email,
    phone,
    zipCode,
    address,
    neighborhood,
    state
   }: EditRecipientUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new RecipientNotFoundError())
    }

    recipient.name = name
    recipient.cpf = cpf
    recipient.email = email
    recipient.phone = phone
    recipient.zipCode = zipCode
    recipient.address = address
    recipient.neighborhood = neighborhood
    recipient.state = state

    await this.recipientsRepository.save(recipient)

    return success({ recipient })
  }
}