import { Either, failure, success } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'

export interface GetRecipientUseCaseRequest {
  recipientId: string
}

type GetRecipientUseCaseResponse = Either<RecipientNotFoundError, { recipient: Recipient }>

export class GetRecipientUseCase {

  constructor(private recipientRepositiry: RecipientsRepository) {}

  async execute({ recipientId }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientRepositiry.findById(recipientId)

    if (!recipient) {
      return failure(new RecipientNotFoundError())
    }

    return success({ recipient })
  }

}