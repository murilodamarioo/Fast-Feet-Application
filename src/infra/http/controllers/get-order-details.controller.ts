import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { GetOrderDetailsUseCase } from '@/domain/delivery/application/uses-cases/get-order-details'
import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

import { RolesGuard } from '@/infra/permission/roles.guard';
import { CheckRoles } from '@/infra/permission/roles.decorator';
import { Action, AppAbility } from '@/infra/permission/ability.factory';

@Controller('/orders/:id')
export class GetOrderDetailsController {

  constructor(private getOrderDetails: GetOrderDetailsUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Order')
  )
  async handle(@Param('id') id: string) {
    const response = await this.getOrderDetails.execute({ orderId: id })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case OrderNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { order: OrderDetailsPresenter.toHTTP(response.value.order) }
  }
}