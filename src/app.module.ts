import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAdminAccountController } from './controllers/create-admin-account.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from './env';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: env => envSchema.parse(env),
      isGlobal: true
    })
  ],
  controllers: [CreateAdminAccountController],
  providers: [PrismaService],
})
export class AppModule {}
