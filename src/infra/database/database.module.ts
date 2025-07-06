import { Module } from '@nestjs/common'

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'

import { PrismaService } from './prisma/prisma.service'

import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'

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
    },
    {
      provide: CouriersRepository,
      useClass: PrismaCouriersRepository
    }
  ],
  exports: [
    PrismaService,
    AdminRepository,
    OrdersRepository,
    RecipientsRepository,
    CouriersRepository
  ]
})
export class DatabaseModule {}