import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { BadRequestException, Body, ConflictException, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { RegisterAdminUseCase } from '@/domain/delivery/application/uses-cases/register-admin';
import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error';
import { Public } from '@/infra/auth/public';

const createAdminAccountBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  password: z.string()
})

type CreateAccountBodySchema = z.infer<typeof createAdminAccountBodySchema>

@Controller('/admin-account')
@Public()
export class CreateAdminAccountController {

  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAdminAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {

    const { name, cpf, email, password } = body

    const response = await this.registerAdmin.execute({
      cpf,
      email,
      name,
      password
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }

}