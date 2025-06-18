import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/delivery/enterprise/entities/Courier'
import { faker } from '@faker-js/faker'

export function makeCourier(override: Partial<CourierProps> = {}, id?: UniqueEntityId) {
  const courier = Courier.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    cpf: faker.string.numeric(11),
    ...override
  }, id)

  return courier
}