import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

import { AuthenticateAdminController } from './controllers/authenticate-admin.controller'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateCourierAccountController } from './controllers/create-courier-account.controller'
import { ChangeAdminPasswordController } from './controllers/change-admin-password.controller'
import { AuthenticateCourierController } from './controllers/authenticate-courier.controller'
import { ChangeCourierPasswordController } from './controllers/change-courier-password.controller'

import { RegisterAdminUseCase } from '@/domain/delivery/application/uses-cases/register-admin'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/uses-cases/authenticate-admin'
import { CreateOrderUseCase } from '@/domain/delivery/application/uses-cases/create-order'
import { ChangeAdminPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-admin-password'
import { RegisterCourierUseCase } from '@/domain/delivery/application/uses-cases/register-courier'
import { AuthenticateCourierUseCase } from '@/domain/delivery/application/uses-cases/authenticate-courier'
import { ChangeCourierPasswordUseCase } from '@/domain/delivery/application/uses-cases/change-courier-password'
import { EditCourierController } from './controllers/edit-courier.controller'
import { EditCourierUseCase } from '@/domain/delivery/application/uses-cases/edit-courier'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAdminAccountController, 
    AuthenticateAdminController, 
    CreateOrderController,
    ChangeAdminPasswordController,
    CreateCourierAccountController,
    AuthenticateCourierController,
    ChangeCourierPasswordController,
    EditCourierController
  ],
  providers:[
    RegisterAdminUseCase,
    AuthenticateAdminUseCase,
    CreateOrderUseCase,
    ChangeAdminPasswordUseCase,
    RegisterCourierUseCase,
    AuthenticateCourierUseCase,
    ChangeCourierPasswordUseCase,
    EditCourierUseCase
  ]
})
export class HttpModule {}