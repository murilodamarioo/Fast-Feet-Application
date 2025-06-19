import { Either, failure, success } from '@/core/either'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { Admin } from '@/domain/delivery/enterprise/entities/Admin'
import { AdminRepository } from '../repositories/admin-repository'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'

export interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, { admin: Admin }>

@Injectable()
export class RegisterAdminUseCase {

  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator
  ) {}

  async execute(
    { name, email, cpf, password }: RegisterAdminUseCaseRequest
  ): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return failure(new UserAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const admin = Admin.create({
      name,
      cpf,
      email,
      password: hashedPassword
    })

    this.adminRepository.create(admin)

    return success({ admin })
  }
}