import { OrderNotFoundError } from '@/core/errors/errors/order-not-found-error'
import { GetOrderDetailsUseCase } from '@/domain/delivery/application/uses-cases/get-order-details'
import { Roles } from '@/infra/permission/roles.decorator';
import { BadRequestException, Controller, Get, HttpCode, NotFoundException, Param } from '@nestjs/common'
import { OrderDetailsPresenter } from '../presenters/order-details-presenter';

@Controller('/orders/:id')
export class GetOrderDetailsController {

  constructor(private getOrderDetails: GetOrderDetailsUseCase) { }

  @Get()
  @HttpCode(200)
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