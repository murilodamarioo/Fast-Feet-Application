import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { hash } from 'bcryptjs'
import { string, z } from 'zod'

const createAdminAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string()
})

type CreateAccountBodySchema = z.infer<typeof createAdminAccountBodySchema>

@Controller('/admin-accounts')
export class CreateAdminAccountController {

  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAdminAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {

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