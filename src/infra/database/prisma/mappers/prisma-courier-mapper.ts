import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Courier } from '@/domain/delivery/enterprise/entities/Courier'

import { Prisma, Role, User as PrismaCourier } from '@prisma/client'

export class PrismaCourierMapper {

  static toDomain(raw: PrismaCourier): Courier {
    return Courier.create({
      cpf: raw.cpf,
      email: raw.email,
      name: raw.name,
      password: raw.password
    }, new UniqueEntityId(raw.id))
  }


  static toPrisma(courier: Courier): Prisma.UserUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf,
      email: courier.email,
      password: courier.password,
      role: Role.COURIER
    }
  }

}