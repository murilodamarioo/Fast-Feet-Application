import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'

import { GetOrderDetailsUseCase } from '@/domain/delivery/application/uses-cases/get-order-details'

import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

import { RolesGuard } from '@/infra/permission/roles.guard';
import { CheckRoles } from '@/infra/permission/roles.decorator';
import { Action, AppAbility } from '@/infra/permission/ability.factory';

@ApiBearerAuth()
@ApiTags('order')
@Controller('/orders/:id')
export class GetOrderDetailsController {

  constructor(private getOrderDetails: GetOrderDetailsUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Order')
  )
  @ApiParam({
    name: 'id',
    description: 'Order Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
  })
  @ApiOkResponse({
    schema: {
      properties: {
        recipient: { type: 'string', example: 'John Doe' },
        address: { type: 'string', example: '123 Main Street, Apt 4B' },
        neighborhood: { type: 'string', example: 'Downtown' },
        zipCode: { type: 'string', example: '12345-678' },
        status: { type: 'string', example: 'Delivered' },
        postedAt: { type: 'string', format: 'date-time', example: '2025-08-20T10:15:30.000Z' },
        pickuedUp: { type: 'string', format: 'date-time', example: '2025-08-21T14:00:00.000Z' },
        deliveredAt: { type: 'string', format: 'date-time', example: '2025-08-22T16:45:00.000Z' },
      },
    },
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'The order was not found' }
      }
    }
  })
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