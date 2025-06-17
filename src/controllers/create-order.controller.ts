import { PrismaService } from '@/prisma/prisma.service'
import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'


@Controller('/order')
@UseGuards(AuthGuard('jwt'))
export class CreateOrderController {

  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle() {
    return 'OK'
  }

}