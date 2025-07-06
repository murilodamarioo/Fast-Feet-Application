import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { Courier } from '@/domain/delivery/enterprise/entities/Courier'

import { PrismaService } from '../prisma.service'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper';

export class PrismaCouriersRepository implements CouriersRepository {

  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Courier | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        cpf
      }
    })

    return user ? PrismaCourierMapper.toDomain(user) : null
  }

  async findById(id: string): Promise<Courier | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    return user ? PrismaCourierMapper.toDomain(user) : null
  }

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.create({
      data
    })
  }

  async save(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.user.update({
      where: {
        id: courier.id.toString()
      },
      data
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id: id.toString()
      }
    })
  }

}