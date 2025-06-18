import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAdminsRepository
  ],
  exports: [
    PrismaService,
    PrismaAdminsRepository
  ]
})
export class DatabaseModule {}