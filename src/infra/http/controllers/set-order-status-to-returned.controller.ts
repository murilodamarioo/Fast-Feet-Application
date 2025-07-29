import { OrderNotFoundError } from "@/core/errors/errors/order-not-found-error";
import { SetOrderStatusError } from "@/core/errors/errors/set-order-status-error";
import { SetOrderStatusToReturnedUseCase } from "@/domain/delivery/application/uses-cases/set-order-status-to-returned";
import { Roles } from "@/infra/permission/roles.decorator";
import { BadRequestException, Controller, HttpCode, InternalServerErrorException, NotFoundException, Param, Put } from "@nestjs/common";

@Controller('/orders/:id/returned')
export class SetOrderStatusToReturnedContoller {

  constructor(private setOrderStatusToReturned: SetOrderStatusToReturnedUseCase) { }

  @Put()
  @HttpCode(200)
  @Roles(['ADMIN'])
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