import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error';
import { Either, failure, success } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/Courier';
import { Injectable } from '@nestjs/common';

export interface EditCourierUseCaseRequest {
  courierId: string
  name: string
  cpf: string
  email: string
}

type EditCourierUseCaseResponse = Either<CourierNotFoundError, { courier: Courier }>

@Injectable()
export class EditCourierUseCase {

  constructor(private couriersRepository: CouriersRepository) {}

  async execute({courierId, name, cpf, email}: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return failure(new CourierNotFoundError())
    }

    courier.name = name || courier.name
    courier.cpf = cpf || courier.cpf
    courier.email = email || courier.email

    await this.couriersRepository.save(courier)

    return success({ courier })
  }

}