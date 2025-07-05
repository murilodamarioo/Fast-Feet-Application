import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { AuthenticateController } from './controllers/authenticate-admin.controller'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'

import { RegisterAdminUseCase } from '@/domain/delivery/application/uses-cases/register-admin'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/uses-cases/authenticate-admin'
import { CreateOrderUseCase } from '@/domain/delivery/application/uses-cases/create-order'
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller'
import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-admin-password'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAdminAccountController, 
    AuthenticateController, 
    CreateOrderController,
    ChangeAdminPasswordController
  ],
  providers:[
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    CreateOrderUseCase,
    ChangeAdminPasswordUseCase
  ]
})
export class HttpModule {}