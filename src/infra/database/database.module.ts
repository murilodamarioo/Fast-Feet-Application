import { Module } from '@nestjs/common'

import { RecipientsRepository } from '@/domain/delivery/application/repositories/recipients-repository'
import { AdminRepository } from '@/domain/delivery/application/repositories/admin-repository'
import { CouriersRepository } from '@/domain/delivery/application/repositories/couriers-repository'
import { OrdersRepository } from '@/domain/delivery/application/repositories/orders-repository'
import { PhotosRepository } from '@/domain/delivery/application/repositories/photos-repository'
import { OrderPhotosRepository } from '@/domain/delivery/application/repositories/order-photos-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notification-repository'

import { PrismaService } from './prisma/prisma.service'

import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'
import { PrismaCouriersRepository } from './prisma/repositories/prisma-couriers-repository'
import { PrismaPhotosRepository } from './prisma/repositories/prisma-photos-repository'
import { PrismaOrderPhotosRepository } from './prisma/repositories/prisma-order-photo-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

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
    },
    {
      provide: OrderPhotosRepository,
      useClass: PrismaOrderPhotosRepository
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository
    }
  ],
  exports: [
    PrismaService,
    AdminRepository,
    OrdersRepository,
    RecipientsRepository,
    CouriersRepository,
    PhotosRepository,
    OrderPhotosRepository,
    NotificationsRepository
  ]
})
export class DatabaseModule { }