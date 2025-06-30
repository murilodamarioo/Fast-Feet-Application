import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Recipient, RecipientProps } from '@/domain/delivery/enterprise/entities/Recipient'

import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

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

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}): Promise<Recipient> {
    const recipient = makeRecipient(data)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(recipient)
    })

    return recipient
  }
} 