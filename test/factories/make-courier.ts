import { Injectable } from '@nestjs/common'

import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'

import { Courier, CourierProps } from '@/domain/delivery/enterprise/entities/Courier'

import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'


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

@Injectable()
export class CourierFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaCourier(data: Partial<CourierProps> = {}): Promise<Courier> {
    const courier = makeCourier(data)

    await this.prisma.user.create({
      data: PrismaCourierMapper.toPrisma(courier)
    })

    return courier
  }
}