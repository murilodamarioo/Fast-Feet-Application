import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post, UseGuards, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiConflictResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { RecipientAlreadyExistsError } from '@/core/errors/errors/recipient-already-exists-error'

import { z } from 'zod'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { RegisterRecipientUseCase } from '@/domain/delivery/application/uses-cases/register-recipient'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const registerRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  email: z.string().email(),
  phone: z.string(),
  zipCode: z.string(),
  address: z.string(),
  neighborhood: z.string(),
  state: z.string()
})

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>

@ApiBearerAuth()
@ApiTags('recipient')
@Controller('/register/recipient')
export class RegisterRecipientController {

  constructor(private registerRecipient: RegisterRecipientUseCase) { }

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerRecipientBodySchema))
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.CREATE, 'Recipient')
  )
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        cpf: { type: 'string', example: '12345678910' },
        email: { type: 'string', example: 'john@gmail.com' },
        phone: { type: 'string', example: '(11)953423455' },
        zipCode: { type: 'string', example: 'NW1 6XE' },
        address: { type: 'string', example: '221B Baker Street' },
        neighborhood: { type: 'string', example: 'Marylebone' },
        state: { type: 'string', example: 'London' }
      }
    }
  })
  @ApiCreatedResponse({
    schema: {
      type: 'object',
      properties: {
        recipient: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef' },
            name: { type: 'string', example: 'John Doe' },
            cpf: { type: 'string', example: '12345678910' },
            email: { type: 'string', example: 'john@gmail.com' },
            phone: { type: 'string', example: '(11)953423455' },
            zipCode: { type: 'string', example: 'NW1 6XE' },
            address: { type: 'string', example: '221B Baker Street' },
            neighborhood: { type: 'string', example: 'Marylebone' },
            state: { type: 'string', example: 'London' },
          }
        }
      }
    }
  })
  @ApiConflictResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Recipient already exists with same email' }
      }
    }
  })
  async handle(@Body() body: RegisterRecipientBodySchema) {
    const { name, cpf, email, phone, zipCode, address, neighborhood, state } = body

    const response = await this.registerRecipient.execute({
      name,
      cpf,
      email,
      phone,
      zipCode,
      address,
      neighborhood,
      state
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    return { recipient: response.value }
  }
}