import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'
import { SetOrderStatusToPickedUpUseCase } from '@/domain/delivery/application/uses-cases/set-order-status-to-picked-up'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'
import { BadRequestException, Controller, HttpCode, InternalServerErrorException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'

@Controller('/orders/:id/pick-up')
export class SetOrderStatusToPickedUpController {

  constructor(private setOrderStatusToPickedUp: SetOrderStatusToPickedUpUseCase) { }

  @Put()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.PICKUP, 'Order')
  )
  async handle(@Param('id') id: string) {

    const response = await this.setOrderStatusToPickedUp.execute({
      orderId: id
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        case SetOrderStatusError:
          throw new BadRequestException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }
}