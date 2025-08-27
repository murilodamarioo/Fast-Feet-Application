import { Controller, Delete, HttpCode, InternalServerErrorException, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNoContentResponse, ApiNotFoundResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'

import { DeleteCourierUseCase } from '@/domain/delivery/application/uses-cases/delete-courier'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { Action, AppAbility } from '@/infra/permission/ability.factory'
import { CheckRoles } from '@/infra/permission/roles.decorator'

@ApiBearerAuth()
@ApiTags('courier')
@Controller('/couriers/:id')
export class DeleteCourierController {

  constructor(private deleteCourier: DeleteCourierUseCase) { }

  @Delete()
  @HttpCode(204)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.DELETE, 'Courier')
  )
  @ApiParam({
    name: 'id',
    description: 'Courier Id',
    type: 'string',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
    required: true
  })
  @ApiNoContentResponse({ description: 'Courier deleted successfully' })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: { message: { type: 'string', example: 'Courier not found' } }
    }
  })
  async handle(@Param('id') id: string) {
    const response = await this.deleteCourier.execute({
      courierId: id
    })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }
  }

}