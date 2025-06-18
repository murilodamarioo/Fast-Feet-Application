import { Either, failure, success } from '@/core/either'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

export interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<RecipientNotFoundError, null>

export class DeleteRecipientUseCase {

  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute({ recipientId }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return failure(new RecipientNotFoundError())
    }

    await this.recipientsRepository.delete(recipientId)

    return success(null)
  }

}