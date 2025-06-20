import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'

import { AuthenticateController } from './controllers/authenticate-admin.controller'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'

import { RegisterAdminUseCase } from '@/domain/delivery/application/uses-cases/register-admin'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAdminAccountController, 
    AuthenticateController, 
    CreateOrderController
  ],
  providers:[
    RegisterAdminUseCase
  ]
})
export class HttpModule {}