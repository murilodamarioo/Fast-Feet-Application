import { BadRequestException, Controller, Delete, HttpCode, InternalServerErrorException, Param } from '@nestjs/common'
import { DeleteRecipientUseCase } from '@/domain/delivery/application/uses-cases/delete-recipient'
import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { Roles } from '@/infra/permission/roles.decorator'

@Controller('/recipients/:id')
export class DeleteRecipientController {

  constructor(private deleteRecipient: DeleteRecipientUseCase) { }

  @Delete()
  @HttpCode(204)
  @Roles(['ADMIN'])
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