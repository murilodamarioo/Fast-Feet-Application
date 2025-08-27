import { Body, Controller, HttpCode, InternalServerErrorException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { EditRecipientUseCase } from '@/domain/delivery/application/uses-cases/edit-recipient'

import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

const editRecipientBodySchema = z.object({
  name: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  zipCode: z.string().optional(),
  address: z.string().optional(),
  neighborhood: z.string().optional(),
  state: z.string().optional()
})

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@ApiBearerAuth()
@ApiTags('recipient')
@Controller('/recpients/:id/edit')
export class EditRecipientController {

  constructor(private editRecipient: EditRecipientUseCase) { }

  @Put()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.UPDATE, 'Recipient')
  )
  @ApiParam({
    name: 'id',
    description: 'Recipient Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: true
  })
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
  @ApiOkResponse({ description: 'Recipient updated successfully' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Recipient not found' }
      }
    }
  })
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditRecipientBodySchema
  ) {
    const { name, email, cpf, phone, zipCode, address, neighborhood, state } = body

    const response = await this.editRecipient.execute({
      recipientId: id,
      name,
      email,
      cpf,
      phone,
      zipCode,
      address,
      neighborhood,
      state
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }

}