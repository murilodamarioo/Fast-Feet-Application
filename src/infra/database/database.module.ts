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
import { PhotosRepository } from '@/domain/delivery/application/repositories/photos-repository'
import { PrismaPhotosRepository } from './prisma/repositories/prisma-photos-repository'

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
    },
    {
      provide: PhotosRepository,
      useClass: PrismaPhotosRepository
    }
  ],
  exports: [
    PrismaService,
    AdminRepository,
    OrdersRepository,
    RecipientsRepository,
    CouriersRepository,
    PhotosRepository
  ]
})
export class DatabaseModule { }