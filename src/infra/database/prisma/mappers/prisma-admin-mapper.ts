import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Admin } from '@/domain/delivery/enterprise/entities/Admin';
import { Prisma, User as PrismaAdmin } from '@prisma/client'

export class PrismaAdminMapper {

  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create({
      cpf: raw.cpf,
      email: raw.email,
      name: raw.name,
      password: raw.password
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      cpf: admin.cpf,
      email: admin.email,
      name: admin.name,
      password: admin.password,
    }
  }

}