import { BadRequestException, Controller, HttpCode, InternalServerErrorException, NotFoundException, Param, Put, UseGuards } from '@nestjs/common'
import { ApiBadRequestResponse, ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { SetOrderStatusError } from '@/core/errors/errors/set-order-status-error'

import { SetOrderStatusToReturnedUseCase } from '@/domain/delivery/application/uses-cases/set-order-status-to-returned'

import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { RolesGuard } from '@/infra/permission/roles.guard'

@ApiBearerAuth()
@ApiTags('order')
@Controller('/orders/:id/returned')
export class SetOrderStatusToReturnedContoller {

  constructor(private setOrderStatusToReturned: SetOrderStatusToReturnedUseCase) { }

  @Put()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.RETURN, 'Order')
  )
  @ApiParam({
    name: 'id',
    description: 'Order Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  })
  @ApiNoContentResponse({ description: 'Order status successfully set to returned' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The order was not found' }
      }
    }
  })
  @ApiBadRequestResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Impossible to change order status from PICKED_UP to PENDING' }
      }
    }
  })
  async handle(@Param('id') id: string) {
    const response = await this.setOrderStatusToReturned.execute({ orderId: id })

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