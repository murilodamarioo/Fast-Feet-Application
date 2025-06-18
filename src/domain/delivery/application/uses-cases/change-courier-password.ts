import { Either, failure, success } from '@/core/either'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'

export interface ChangeCourierPasswordUseCaseRequest {
  courierId: string
  newPassword: string
}

type ChangeCourierPasswordUseCaseResponse = Either<CourierNotFoundError, null>

export class ChangeCourierPasswordUseCase {
  
  constructor(private couriersRepository: CouriersRepository) {}

  async execute(
    { courierId, newPassword }: ChangeCourierPasswordUseCaseRequest
  ): Promise<ChangeCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return failure(new CourierNotFoundError())
    }

    courier.password = newPassword
    
    await this.couriersRepository.save(courier)

    return success(null)
  }
}