import { Either, failure, success } from '@/core/either'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'
import { RecipientAlreadyExistsError } from '@/core/errors/errors/recipient-already-exists-error'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { getCoordinatesFromAddress } from '@/core/utils/get-cordinates-from-adreess'

export interface RegisterRecipientUseCaseRequest {
    name: string
    cpf: string
    email: string
    phone: string
    zipCode: string
    address: string
    neighborhood: string
    state: string
}

type RegisterRecipientUseCaseResponse = Either<RecipientAlreadyExistsError, { recipient: Recipient }>

export class RegisterRecipientUseCase {

  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({ 
    name, 
    cpf, 
    email, 
    phone, 
    zipCode, 
    address, 
    neighborhood, 
    state 
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameEmail = await this.recipientsRepository.findByEmail(email)

    if (recipientWithSameEmail) {
      return failure(new RecipientAlreadyExistsError())
    }
    
    const fullAddress = `${address}, ${neighborhood}, ${zipCode}, ${state}`

    const coordinates = await getCoordinatesFromAddress(fullAddress)

    const latitude = coordinates?.latitude ?? 0
    const longitude = coordinates?.longitude ?? 0

    const recipient = Recipient.create({
      name,
      cpf,
      email,
      phone,
      zipCode,
      address,
      neighborhood,
      state,
      latitude,
      longitude
    })

    await this.recipientsRepository.create(recipient)

    return success({ recipient })
  }
}