import { BadRequestException, Controller, Delete, HttpCode, InternalServerErrorException, Param, UseGuards } from '@nestjs/common'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { DeleteCourierUseCase } from '@/domain/delivery/application/uses-cases/delete-courier'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { CheckRoles } from '@/infra/permission/roles.decorator'

@Controller('/couriers/:id')
export class DeleteCourierController {

  constructor(private deleteCourier: DeleteCourierUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELETE, 'Courier')
  )
  async handle(@Param('id') id: string) {
    const response = await this.deleteCourier.execute({
      courierId: id
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }

}