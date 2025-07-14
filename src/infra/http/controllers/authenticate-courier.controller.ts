import { BadRequestException, Body, Post, UnauthorizedException, UsePipes, HttpCode, Controller } from '@nestjs/common'

import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import { AuthenticateCourierUseCase } from '@/domain/delivery/application/uses-cases/authenticate-courier'

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string()
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions/couriers')
@Public()
export class AuthenticateCourierController {

  constructor(private authenticateCourier: AuthenticateCourierUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body

    const response = await this.authenticateCourier.execute({
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