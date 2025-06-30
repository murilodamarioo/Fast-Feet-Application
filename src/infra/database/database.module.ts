import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminRepository,
      useClass: PrismaAdminsRepository
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository
    }
  ],
  exports: [
    PrismaService,
    AdminRepository,
    OrdersRepository,
    RecipientsRepository
  ]
})
export class DatabaseModule {}