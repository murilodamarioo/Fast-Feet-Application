import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'

import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'

import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'

export interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<WrongCredentialsError, { access_token: string }>

@Injectable()
export class AuthenticateCourierUseCase {
  constructor(
    private couriersRepository: CouriersRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({
    cpf,
    password
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComparer.compare(password, courier.password)

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError())
    }

    const access_token = await this.encrypter.encrypt({
      sub: courier.id.toString()
    })

    return success({ access_token })
  }
}