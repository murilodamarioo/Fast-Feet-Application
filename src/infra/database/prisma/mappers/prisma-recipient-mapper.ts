import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'

import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {

  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create({
      name: raw.name,
      email: raw.email,
      cpf: raw.cpf,
      phone: raw.phone,
      zipCode: raw.zipCode,
      address: raw.address,
      neighborhood: raw.neighborhood,
      state: raw.state,
      latitude: Number(raw.latitude),
      longitude: Number(raw.longitude),
    }, new UniqueEntityId(raw.id))
  }

  static toPrisma(data: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: data.id.toString(),
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
      zipCode: data.zipCode,
      address: data.address,
      neighborhood: data.neighborhood,
      state: data.state,
      latitude: String(data.latitude),
      longitude: String(data.longitude)
    }
  }

}