import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { GetCourierUseCase } from '@/domain/delivery/application/uses-cases/get-courier'
import { Roles } from '@/infra/permission/roles.decorator'
import { BadRequestException, Controller, Get, HttpCode, InternalServerErrorException, Param } from '@nestjs/common'
import { CourierPresenter } from '../presenters/courier-presenter'

@Controller('/couriers/:id')
export class GetCourierController {

  constructor(private getCourier: GetCourierUseCase) { }

  @Get()
  @HttpCode(200)
  @Roles(['ADMIN'])
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