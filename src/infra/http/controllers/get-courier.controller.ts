import { Controller, Get, HttpCode, InternalServerErrorException, NotFoundException, Param, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger'

import { CourierNotFoundError } from '@/core/errors/errors/courier-not-found-error'
import { GetCourierUseCase } from '@/domain/delivery/application/uses-cases/get-courier'

import { CourierPresenter } from '../presenters/courier-presenter'

import { RolesGuard } from '@/infra/permission/roles.guard'
import { CheckRoles } from '@/infra/permission/roles.decorator'
import { Action, AppAbility } from '@/infra/permission/ability.factory'

@ApiBearerAuth()
@ApiTags('courier')
@Controller('/couriers/:id')
export class GetCourierController {

  constructor(private getCourier: GetCourierUseCase) { }

  @Get()
  @HttpCode(200)
  @UseGuards(RolesGuard)
  @CheckRoles((ability: AppAbility) =>
    ability.can(Action.READ, 'Courier')
  )
  @ApiParam({
    name: 'id',
    description: 'Courier Id',
    type: 'string',
    format: 'uuid',
    example: '0d4b4f8c-2b2e-4b4f-8c2b-2b2e4b4f8c2b',
    required: true
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        courier: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '0d4b4f8c-2b2e-4b4f-8c2b-2b2e4b4f8c2b' },
            name: { type: 'string', example: 'John Doe' },
            cpf: { type: 'string', example: '12345678910' },
            email: { type: 'string', example: 'john@gmail.com' }
          }
        }
      }
    }
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        courier: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '0d4b4f8c-2b2e-4b4f-8c2b-2b2e4b4f8c2b' },
            name: { type: 'string', example: 'John Doe' },
            cpf: { type: 'string', example: '12345678910' },
            email: { type: 'string', example: 'john@gmail.com' }
          }
        }
      }
    }
  })
  @ApiNotFoundResponse({
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Courier not found' }
      }
    }
  })
  async handle(@Param('id') id: string) {
    const response = await this.getCourier.execute({ courierId: id })

    if (response.isFailure()) {
      const error = response.value

      switch (error.constructor) {
        case CourierNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new InternalServerErrorException(error.message)
      }
    }

    return { courier: CourierPresenter.toHTTP(response.value.courier) }
  }

}