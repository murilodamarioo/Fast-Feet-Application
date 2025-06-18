import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminsRepository
    }
  ],
  exports: [
    PrismaService,
    AdminRepository
  ]
})
export class DatabaseModule {}