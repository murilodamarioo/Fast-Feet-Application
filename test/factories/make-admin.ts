import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/delivery/enterprise/entities/Admin'
import { faker } from '@faker-js/faker'

export function makeAdmin(override: Partial<AdminProps> = {}, id?: UniqueEntityId) {
  const admin = Admin.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: faker.string.numeric(11),
    ...override
  }, id)

  return admin
}