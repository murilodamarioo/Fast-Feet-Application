import { Either, failure, success } from '@/core/either'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { Admin } from '@/domain/delivery/enterprise/entities/Admin'
import { AdminRepository } from '../repositories/admin-repository'

export interface RegisterAdminUseCaseRequest {
  name: string
  cpf: string
  email: string
  password: string
}

type RegisterAdminUseCaseResponse = Either<UserAlreadyExistsError, { admin: Admin }>

export class RegisterAdminUseCase {

  constructor(private adminRepository: AdminRepository) {}

  async execute(
    { name, email, cpf, password }: RegisterAdminUseCaseRequest
  ): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSameCpf = await this.adminRepository.findByCpf(cpf)

    if (adminWithSameCpf) {
      return failure(new UserAlreadyExistsError())
    }

    const admin = Admin.create({
      name,
      cpf,
      email,
      password
    })

    return success({ admin })
  }
}