import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'
import { faker } from '@faker-js/faker'

export function makeRecipient(override: Partial<Recipient> = {}, id?: UniqueEntityId): Recipient {
  const recipient = Recipient.create({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    cpf: faker.string.numeric(11),
    zipCode: faker.location.zipCode(),
    address: faker.location.streetAddress(),
    neighborhood: faker.location.street(),
    state: faker.location.state(),
    latitude: faker.location.latitude(),
    longitude: faker.location.longitude(),
    ...override
  }, id)

  return recipient
}