import { Courier } from '@/domain/delivery/enterprise/entities/Courier'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Either, failure, success } from '@/core/either'
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'

interface RegisterCourierUseCaseRequest {
  name: string
  email: string
  cpf: string
  password: string
}

type ResgisterCourierUseCaseResponse = Either<UserAlreadyExistsError, { courier: Courier }>

export class RegisterCourierUseCase {

  constructor(private couriersRepository: CouriersRepository) {}

  async execute({ name, email, cpf, password }: RegisterCourierUseCaseRequest): Promise<ResgisterCourierUseCaseResponse> {

    const courierWithSameCpf = await this.couriersRepository.findByCpf(cpf)

    if (courierWithSameCpf) {
      return failure(new UserAlreadyExistsError())
    }

    const courier = Courier.create({
      name,
      email,
      password,
      cpf
    })

    await this.couriersRepository.create(courier)

    return success({ courier })
  }
}