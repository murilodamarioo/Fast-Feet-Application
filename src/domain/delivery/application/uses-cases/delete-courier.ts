import { Either, failure, success } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

export interface DeleteCourierUseCaseRequest {
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<CourierNotFoundError, null>

export class DeleteCourierUseCase {

  constructor(private couriersRepository: CouriersRepository) {}

  async execute({ courierId }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return failure(new CourierNotFoundError())
    }

    await this.couriersRepository.delete(courierId)

    return success(null)
  }
}