import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAdminAccountController } from './controllers/create-admin-account.controller'
import { CreateOrderController } from './controllers/create-order.controller'
import { DatabaseModule } from '@faker-js/faker/.'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAdminAccountController, 
    AuthenticateController, 
    CreateOrderController
  ],
})
export class HttpModule {}