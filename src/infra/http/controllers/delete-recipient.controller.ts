import { Controller, Delete, HttpCode, InternalServerErrorException, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { DeleteRecipientUseCase } from '@/domain/delivery/application/uses-cases/delete-recipient'

import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

@ApiBearerAuth()
@ApiTags('recipient')
@Controller('/recipients/:id')
export class DeleteRecipientController {

  constructor(private deleteRecipient: DeleteRecipientUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELETE, 'Recipient')
  )
  @ApiParam({
    name: 'id',
    description: 'Recipient Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: true
  })
  @ApiNoContentResponse({ description: 'Recipient deleted successfully' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Recipient not found' } }
    }
  })
  async handle(@Param('id') id: string) {
    const response = await this.deleteRecipient.execute({
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
  }

}