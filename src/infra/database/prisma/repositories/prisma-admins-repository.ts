import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { Admin } from '@/domain/delivery/enterprise/entities/Admin';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper';

@Injectable()
export class PrismaAdminsRepository implements AdminRepository {

  constructor(private prisma: PrismaService) {}

  async findByCpf(cpf: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        cpf
      }
    })

    return admin ? PrismaAdminMapper.toDomain(admin) : null
  }
  
  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    return admin ? PrismaAdminMapper.toDomain(admin) : null
  }
  
  async create(admin: Admin): Promise<void> {

    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.create({
      data
    })
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.user.update({
      where: {
        id: admin.id.toString()
      },
      data
    })
  }

}