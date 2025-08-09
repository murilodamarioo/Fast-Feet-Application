import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { GetCourierUseCase } from '@/domain/delivery/application/uses-cases/get-courier'
import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Param, UseGuards } from '@nestjs/common'
import { CourierPresenter } from '../presenters/courier-presenter'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

@Controller('/couriers/:id')
export class GetCourierController {

  constructor(private getCourier: GetCourierUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Courier')
  )
  async handle(@Param('id') id: string) {
    const response = await this.getCourier.execute({ courierId: id })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    return { courier: CourierPresenter.toHTTP(response.value.courier) }
  }

}