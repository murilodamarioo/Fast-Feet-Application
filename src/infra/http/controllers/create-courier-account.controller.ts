import { Controller, HttpCode, Post, UsePipes, Body, BadRequestException, ConflictException, UseGuards } from '@nestjs/common'

import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { UserAlreadyExistsError } from '@/core/errors/errors/user-already-exists-error'
import { RegisterCourierUseCase } from '@/domain/delivery/application/uses-cases/register-courier'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

const createCourierAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  password: z.string()
})

type CreateCourierAccountBodySchema = z.infer<typeof createCourierAccountBodySchema>

@ApiBearerAuth()
@ApiTags('accounts')
@Controller('/accounts/courier')
export class CreateCourierAccountController {

  constructor(private registerCourier: RegisterCourierUseCase) { }

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.CREATE, 'Courier')
  )
  @UsePipes(new ZodValidationPipe(createCourierAccountBodySchema))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Jane Doe' },
        email: { type: 'string', example: 'jane@gmail.com' },
        cpf: { type: 'string', example: '12345678910' },
        password: { type: 'string', example: 'P@ssw0rd' }
      },
      required: ['name', 'cpf', 'email', 'password']
    }
  })
  @ApiCreatedResponse({ description: 'Courier created successfully' })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User with the same CPF already exists' }
      }
    }
  })
  async handle(@Body() body: CreateCourierAccountBodySchema) {
    const { name, email, cpf, password } = body

    const response = await this.registerCourier.execute({
      name,
      email,
      cpf,
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