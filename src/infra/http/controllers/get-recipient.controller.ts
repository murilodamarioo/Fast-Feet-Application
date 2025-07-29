import { RecipientNotFoundError } from '@/core/errors/errors/recipient-not-found-error'
import { GetRecipientUseCase } from '@/domain/delivery/application/uses-cases/get-recipient'
import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Param } from '@nestjs/common'
import { RecipientPresenter } from '../presenters/recipient-presenter'
import { Roles } from '@/infra/permission/roles.decorator'

@Controller('/recipients/:id')
export class GetRecipientController {

  constructor(private getRecipient: GetRecipientUseCase) { }

  @Get()
  @HttpCode(200)
  @Roles(['ADMIN'])
  async handle(@Param('id') id: string) {
    const response = await this.getRecipient.execute({
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

    return { recipient: RecipientPresenter.toHTTP(response.value.recipient) }
  }
}