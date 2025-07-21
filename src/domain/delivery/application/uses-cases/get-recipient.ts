import { Either, failure, success } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'
import { Injectable } from '@nestjs/common'

export interface GetRecipientUseCaseRequest {
  recipientId: string
}

type GetRecipientUseCaseResponse = Either<RecipientNotFoundError, { recipient: Recipient }>

@Injectable()
export class GetRecipientUseCase {

  constructor(private recipientRepository: RecipientsRepository) { }

  async execute({ recipientId }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return failure(new RecipientNotFoundError())
    }

    return success({ recipient })
  }

}