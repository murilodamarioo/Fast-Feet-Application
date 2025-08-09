import { BadRequestException, Controller, Delete, HttpCode, InternalServerErrorException, Param, UseGuards } from '@nestjs/common'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/uses-cases/delete-recipient'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'

import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

@Controller('/recipients/:id')
export class DeleteRecipientController {

  constructor(private deleteRecipient: DeleteRecipientUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELETE, 'Recipient')
  )
  async handle(@Param('id') id: string) {
    const response = await this.deleteRecipient.execute({
      recipientId: id
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }

}