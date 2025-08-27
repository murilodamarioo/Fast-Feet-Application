import { Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { GetRecipientUseCase } from '@/domain/delivery/application/uses-cases/get-recipient'

import { RecipientPresenter } from '../presenters/recipient-presenter'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'


@ApiBearerAuth()
@ApiTags('recipient')
@Controller('/recipients/:id')
export class GetRecipientController {

  constructor(private getRecipient: GetRecipientUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Recipient')
  )
  @ApiParam({
    name: 'id',
    description: 'Recipient Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  })
  @ApiOkResponse({
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
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Recipient not found' }
      }
    }
  })
  async handle(@Param('id') id: string) {
    const response = await this.getRecipient.execute({
      recipientId: id
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

    return { recipient: RecipientPresenter.toHTTP(response.value.recipient) }
  }
}