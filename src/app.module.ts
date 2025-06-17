import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAdminAccountController } from './controllers/create-admin-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    }),
    AuthModule
  ],
  controllers: [CreateAdminAccountController, AuthenticateController],
  providers: [PrismaService],
})
export class AppModule {}
