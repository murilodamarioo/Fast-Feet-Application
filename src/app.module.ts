import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAdminAccountController } from './controllers/create-admin-account.controller';

@Module({
  controllers: [CreateAdminAccountController],
  providers: [PrismaService],
})
export class AppModule {}
