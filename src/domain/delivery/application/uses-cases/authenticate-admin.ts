import { Either, failure, success } from '@/core/either'
import { AdminRepository } from '../repositories/admin-repository'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { Injectable } from '@nestjs/common'

export interface AuthenticateAdminUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<WrongCredentialsError, { access_token: string }>

@Injectable()
export class AuthenticateAdminUseCase {

  constructor(
    private adminRepository: AdminRepository,
    private hashComaprer: HashComparer,
    private encrypter: Encrypter
  ) {}

  async execute({ cpf, password }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminRepository.findByCpf(cpf)

    if (!admin) {
      return failure(new WrongCredentialsError())
    }

    const isPasswordValid = await this.hashComaprer.compare(password, admin.password)

    if (!isPasswordValid) {
      return failure(new WrongCredentialsError())
    }

    const access_token = await this.encrypter.encrypt({ 
      sub: admin.id.toString() 
    })

    return success({ access_token })
  }

}