import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { Recipient } from '@/domain/delivery/enterprise/entities/Recipient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper';

@Injectable()
export class PrismaRecipientsRepository implements RecipientsRepository {

  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email
      }
    })

    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id
      }
    })

    return recipient ? PrismaRecipientMapper.toDomain(recipient) : null
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data
    })
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: recipient.id.toString()
      },
      data
    })
  }
  
  async delete(id: string): Promise<void> {
    await this.prisma.recipient.delete({
      where: {
        id
      }
    })
  }

}