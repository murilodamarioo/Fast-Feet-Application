import { Either, failure, success } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/Courier'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

export interface GetCourierUseCaseRequest {
  courierId: string
}

type GetCourierUseCaseResponse = Either<Error, { courier: Courier }>

export class GetCourierUseCase {
  
  constructor(private couriersRepository: CouriersRepository) {}

  async execute({ courierId }: GetCourierUseCaseRequest): Promise<GetCourierUseCaseResponse> {
    
    const courier = await this.couriersRepository.findById(courierId)

    if(!courier) {
      return failure(new CourierNotFoundError())
    }

    return success({ courier })
  }
}