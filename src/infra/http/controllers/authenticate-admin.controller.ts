
import { z } from 'zod'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { AuthenticateAdminUseCase } from '@/domain/delivery/application/uses-cases/authenticate-admin';
import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string()
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions/admin')
@Public()
export class AuthenticateController {

  constructor(private authenticateAdmin: AuthenticateAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const response = await this.authenticateAdmin.execute({
      cpf,
      password
    })

     if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
     }

    const { access_token } = response.value

    return { access_token }
  }
}