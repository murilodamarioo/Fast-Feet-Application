import { BadRequestException, Body, Controller, HttpCode, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger'

import { z } from 'zod'

import { WrongCredentialsError } from '@/core/errors/errors/wrong-credentials-error';

import { AuthenticateAdminUseCase } from '@/domain/delivery/application/uses-cases/authenticate-admin';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public';

const authenticateBodySchema = z.object({
  cpf: z.string(),
  password: z.string()
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@ApiTags('auth')
@Controller('/sessions/admin')
@Public()
export class AuthenticateAdminController {

  constructor(private authenticateAdmin: AuthenticateAdminUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  @ApiOperation({ summary: 'Authenticate an Admin user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        cpf: { type: 'string', example: '12345678910' },
        password: { type: 'string', example: 'newP@ssw0rd' },
      },
      required: ['cpf', 'password'],
    }
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string' }
      }
    },
    description: 'Admin authenticated successfully.'
  })
  @ApiUnauthorizedResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Credentials are not valid.' },
      }
    },
    description: 'Credentials are not valid.'
  })
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