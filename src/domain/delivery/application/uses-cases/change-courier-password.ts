import { Injectable } from '@nestjs/common'
import { Either, failure, success } from '@/core/either'
import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { HashGenerator } from '../cryptography/hash-generator'

export interface ChangeCourierPasswordUseCaseRequest {
  courierId: string
  newPassword: string
}

type ChangeCourierPasswordUseCaseResponse = Either<CourierNotFoundError, null>

@Injectable()
export class ChangeCourierPasswordUseCase {
  
  constructor(
    private couriersRepository: CouriersRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(
    { courierId, newPassword }: ChangeCourierPasswordUseCaseRequest
  ): Promise<ChangeCourierPasswordUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return failure(new CourierNotFoundError())
    }

    courier.password = await this.hashGenerator.hash(newPassword)
    await this.couriersRepository.save(courier)

    return success(null)
  }
}