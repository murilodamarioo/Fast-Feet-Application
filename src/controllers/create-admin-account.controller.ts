import { PrismaService } from '@/prisma/prisma.service';
import { Body, ConflictException, Controller, HttpCode, Post } from '@nestjs/common'
import { hash } from 'bcryptjs';

@Controller('/admin-accounts')
export class CreateAdminAccountController {

  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: any) {

    const { name, cpf, email, password } = body

    const userWithSameCpf = await this.prisma.user.findUnique({
      where: {
        cpf
      }
    })

    if (userWithSameCpf) {
      throw new ConflictException(
        'User with same CPF already exists.',
      )
    }

    const hashedPassword = await hash(password, 8)

    await this.prisma.user.create({
      data: {
        name,
        email,
        cpf,
        password: hashedPassword
      }
    })
  }

}