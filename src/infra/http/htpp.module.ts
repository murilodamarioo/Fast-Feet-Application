import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateAdminAccountController, 
    AuthenticateController, 
    CreateOrderController
  ],
  providers: [PrismaService]
})
export class HttpModule {}